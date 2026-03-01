// ============================================
// 크레딧 조회 API
// GET /api/credits
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { getUserCredits } from '@/lib/credits';

export async function GET(request: NextRequest) {
  try {
    // 인증 확인
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

    // 크레딧 조회
    const credits = await getUserCredits(user.id);

    return NextResponse.json({
      success: true,
      credits,
    });
  } catch (error: any) {
    console.error('Credits API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
