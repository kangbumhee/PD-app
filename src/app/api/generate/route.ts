export const dynamic = 'force-dynamic';

// ============================================
// 이미지 생성 API
// POST /api/generate
// Body: { prompt: string, style: string }
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient, createSupabaseAdmin } from '@/lib/supabase-server';
import { generateImage } from '@/lib/gemini';
import { deductCredit } from '@/lib/credits';
import type { StyleId } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    // 1. 인증 확인
    const supabase = createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // 2. 요청 바디 파싱
    const body = await request.json();
    const { prompt, style } = body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      );
    }

    if (prompt.length > 1000) {
      return NextResponse.json(
        { success: false, error: 'Prompt is too long (max 1000 characters)' },
        { status: 400 }
      );
    }

    const styleId: StyleId = style || 'realistic';

    // 3. 크레딧 차감
    const creditResult = await deductCredit(user.id);

    if (!creditResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: creditResult.error || 'Not enough credits',
          creditsRemaining: creditResult.remaining,
        },
        { status: 402 }
      );
    }

    // 4. Gemini API로 이미지 생성
    const imageResult = await generateImage(prompt.trim(), styleId);

    if (!imageResult.success || !imageResult.imageBase64) {
      // 이미지 생성 실패 시 크레딧 환불
      const admin = createSupabaseAdmin();
      await admin
        .from('profiles')
        .update({ credits: creditResult.remaining + 1 })
        .eq('id', user.id);

      await admin.from('credit_transactions').insert({
        user_id: user.id,
        amount: 1,
        type: 'generation',
        description: 'Refund - image generation failed',
      });

      return NextResponse.json(
        {
          success: false,
          error: imageResult.error || 'Failed to generate image',
          creditsRemaining: creditResult.remaining + 1,
        },
        { status: 500 }
      );
    }

    // 5. 생성 기록 저장
    const admin = createSupabaseAdmin();
    const { data: generation, error: insertError } = await admin
      .from('generations')
      .insert({
        user_id: user.id,
        prompt: prompt.trim(),
        style: styleId,
        image_url: imageResult.imageBase64,
        credits_used: 1,
      })
      .select('id')
      .single();

    if (insertError) {
      console.error('Failed to save generation:', insertError);
    }

    // 6. 성공 응답
    return NextResponse.json({
      success: true,
      imageBase64: imageResult.imageBase64,
      generationId: generation?.id || null,
      creditsRemaining: creditResult.remaining,
    });
  } catch (error: any) {
    console.error('Generate API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
