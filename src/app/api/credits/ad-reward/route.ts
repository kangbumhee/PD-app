export const dynamic = 'force-dynamic';

// ============================================
// 광고 시청 보상 API
// POST /api/credits/ad-reward
// Body: { adType: 'rewarded_video' | 'offerwall' }
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient, createSupabaseAdmin } from '@/lib/supabase-server';
import { addCredit, CREDIT_CONFIG } from '@/lib/credits';

// 광고 남용 방지: 유저별 마지막 보상 시간 추적
const lastRewardTime = new Map<string, number>();
const REWARD_COOLDOWN_MS = 30 * 1000; // 30초 쿨다운
const MAX_DAILY_AD_REWARDS = 30; // 하루 최대 30회

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

    // 2. 쿨다운 체크
    const now = Date.now();
    const lastTime = lastRewardTime.get(user.id) || 0;

    if (now - lastTime < REWARD_COOLDOWN_MS) {
      const waitSeconds = Math.ceil((REWARD_COOLDOWN_MS - (now - lastTime)) / 1000);
      return NextResponse.json(
        {
          success: false,
          error: `Please wait ${waitSeconds} seconds before watching another ad`,
        },
        { status: 429 }
      );
    }

    // 3. 일일 광고 보상 횟수 체크
    const admin = createSupabaseAdmin();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const { count, error: countError } = await admin
      .from('credit_transactions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('type', 'ad_reward')
      .gte('created_at', todayStart.toISOString());

    if (!countError && count !== null && count >= MAX_DAILY_AD_REWARDS) {
      return NextResponse.json(
        {
          success: false,
          error: `Daily ad reward limit reached (${MAX_DAILY_AD_REWARDS}/day). Come back tomorrow!`,
        },
        { status: 429 }
      );
    }

    // 4. 요청 바디 파싱
    const body = await request.json().catch(() => ({}));
    const adType = body.adType || 'rewarded_video';

    // 5. 크레딧 지급
    const rewardAmount = CREDIT_CONFIG.AD_REWARD; // 기본 1크레딧
    const result = await addCredit(
      user.id,
      rewardAmount,
      'ad_reward',
      `Ad reward - ${adType}`
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to add reward' },
        { status: 500 }
      );
    }

    // 6. 쿨다운 기록
    lastRewardTime.set(user.id, now);

    return NextResponse.json({
      success: true,
      creditsAdded: rewardAmount,
      totalCredits: result.total,
    });
  } catch (error: any) {
    console.error('Ad Reward API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
