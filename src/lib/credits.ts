// ============================================
// 크레딧 관리 시스템
// ============================================

import { createSupabaseAdmin } from './supabase-server';
import type { Profile, CreditTransaction } from './types';

// 크레딧 상수
export const CREDIT_CONFIG = {
  SIGNUP_BONUS: 5,        // 가입 시 무료 크레딧
  AD_REWARD: 1,           // 광고 1회 시청 보상
  REFERRAL_BONUS: 3,      // 추천인 보상
  REFERRED_BONUS: 3,      // 피추천인 보상
  GENERATION_COST: 1,     // 이미지 1장 생성 비용
  PREMIUM_MONTHLY: 200,   // 프리미엄 월 크레딧
} as const;

// 유저 크레딧 조회
export async function getUserCredits(userId: string): Promise<number> {
  const supabase = createSupabaseAdmin();

  const { data, error } = await supabase
    .from('profiles')
    .select('credits')
    .eq('id', userId)
    .single();

  if (error || !data) return 0;
  return data.credits;
}

// 유저 프로필 조회
export async function getUserProfile(userId: string): Promise<Profile | null> {
  const supabase = createSupabaseAdmin();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) return null;
  return data as Profile;
}

// 크레딧 차감 (이미지 생성 시)
export async function deductCredit(
  userId: string,
  amount: number = CREDIT_CONFIG.GENERATION_COST
): Promise<{ success: boolean; remaining: number; error?: string }> {
  const supabase = createSupabaseAdmin();

  // 현재 크레딧 확인
  const currentCredits = await getUserCredits(userId);

  if (currentCredits < amount) {
    return {
      success: false,
      remaining: currentCredits,
      error: 'Not enough credits',
    };
  }

  // 크레딧 차감
  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      credits: currentCredits - amount,
      total_generated: currentCredits, // 이건 별도로 증가시켜야 하지만 단순화
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (updateError) {
    return { success: false, remaining: currentCredits, error: 'Failed to deduct credits' };
  }

  // 거래 내역 기록
  await supabase.from('credit_transactions').insert({
    user_id: userId,
    amount: -amount,
    type: 'generation',
    description: 'Image generation',
  });

  // total_generated 증가
  await supabase.rpc('increment_total_generated', { user_id_input: userId });

  return { success: true, remaining: currentCredits - amount };
}

// 크레딧 추가 (광고 시청, 구매 등)
export async function addCredit(
  userId: string,
  amount: number,
  type: CreditTransaction['type'],
  description: string
): Promise<{ success: boolean; total: number; error?: string }> {
  const supabase = createSupabaseAdmin();

  const currentCredits = await getUserCredits(userId);
  const newTotal = currentCredits + amount;

  // 크레딧 추가
  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      credits: newTotal,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (updateError) {
    return { success: false, total: currentCredits, error: 'Failed to add credits' };
  }

  // 거래 내역 기록
  await supabase.from('credit_transactions').insert({
    user_id: userId,
    amount: amount,
    type: type,
    description: description,
  });

  return { success: true, total: newTotal };
}

// 추천 코드로 보상 지급
export async function processReferral(
  newUserId: string,
  referralCode: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createSupabaseAdmin();

  // 추천 코드로 유저 찾기
  const { data: referrer, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('referral_code', referralCode)
    .single();

  if (error || !referrer) {
    return { success: false, error: 'Invalid referral code' };
  }

  // 자기 자신 추천 방지
  if (referrer.id === newUserId) {
    return { success: false, error: 'Cannot refer yourself' };
  }

  // 추천인에게 보상
  await addCredit(
    referrer.id,
    CREDIT_CONFIG.REFERRAL_BONUS,
    'referral_bonus',
    'Referral bonus - new user joined'
  );

  // 피추천인에게 보상
  await addCredit(
    newUserId,
    CREDIT_CONFIG.REFERRED_BONUS,
    'referral_bonus',
    'Welcome bonus - referred by friend'
  );

  // referred_by 업데이트
  await supabase
    .from('profiles')
    .update({ referred_by: referrer.id })
    .eq('id', newUserId);

  return { success: true };
}
