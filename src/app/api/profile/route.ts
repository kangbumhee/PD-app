export const dynamic = 'force-dynamic';

// ============================================
// 프로필 조회/수정 API
// GET /api/profile - 프로필 조회
// PATCH /api/profile - 프로필 수정
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient, createSupabaseAdmin } from '@/lib/supabase-server';
import { getUserProfile } from '@/lib/credits';

// 프로필 조회
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

    const profile = await getUserProfile(user.id);

    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      profile,
    });
  } catch (error: any) {
    console.error('Profile GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 프로필 수정
export async function PATCH(request: NextRequest) {
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
    const { display_name } = body;

    // 수정 가능한 필드만 허용
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (display_name && typeof display_name === 'string') {
      updateData.display_name = display_name.trim().slice(0, 50);
    }

    const admin = createSupabaseAdmin();
    const { error: updateError } = await admin
      .from('profiles')
      .update(updateData)
      .eq('id', user.id);

    if (updateError) {
      return NextResponse.json(
        { success: false, error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    const updatedProfile = await getUserProfile(user.id);

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
    });
  } catch (error: any) {
    console.error('Profile PATCH Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
