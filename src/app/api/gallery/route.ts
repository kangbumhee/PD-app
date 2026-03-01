export const dynamic = 'force-dynamic';

// ============================================
// 갤러리 API
// GET /api/gallery - 내 이미지 목록 조회
// DELETE /api/gallery - 이미지 삭제
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient, createSupabaseAdmin } from '@/lib/supabase-server';

// 갤러리 조회 (페이지네이션)
export async function GET(request: NextRequest) {
  try {
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

    // 페이지네이션 파라미터
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    const admin = createSupabaseAdmin();

    // 총 개수 조회
    const { count } = await admin
      .from('generations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    // 이미지 목록 조회
    const { data: generations, error: fetchError } = await admin
      .from('generations')
      .select('id, prompt, style, image_url, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (fetchError) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch gallery' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      generations: generations || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error: any) {
    console.error('Gallery GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 이미지 삭제
export async function DELETE(request: NextRequest) {
  try {
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

    const body = await request.json();
    const { generationId } = body;

    if (!generationId) {
      return NextResponse.json(
        { success: false, error: 'Generation ID is required' },
        { status: 400 }
      );
    }

    const admin = createSupabaseAdmin();

    // 본인 이미지인지 확인 후 삭제
    const { error: deleteError } = await admin
      .from('generations')
      .delete()
      .eq('id', generationId)
      .eq('user_id', user.id);

    if (deleteError) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete image' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Gallery DELETE Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
