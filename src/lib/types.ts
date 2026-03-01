// ============================================
// Pixdap 타입 정의
// ============================================

export interface Profile {
  id: string;
  email: string | null;
  display_name: string | null;
  credits: number;
  is_premium: boolean;
  referral_code: string | null;
  referred_by: string | null;
  total_generated: number;
  created_at: string;
  updated_at: string;
}

export interface Generation {
  id: string;
  user_id: string;
  prompt: string;
  style: string;
  image_url: string | null;
  credits_used: number;
  created_at: string;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'signup_bonus' | 'ad_reward' | 'purchase' | 'generation' | 'referral_bonus';
  description: string | null;
  created_at: string;
}

export interface GenerateRequest {
  prompt: string;
  style: string;
}

export interface GenerateResponse {
  success: boolean;
  imageBase64?: string;
  error?: string;
  creditsRemaining?: number;
}

export interface CreditResponse {
  success: boolean;
  credits?: number;
  error?: string;
}

// 이미지 생성 스타일 옵션
export const IMAGE_STYLES = [
  { id: 'realistic', label: 'Realistic', labelKo: '사실적', prompt: 'photorealistic, high quality, detailed' },
  { id: 'ghibli', label: 'Ghibli', labelKo: '지브리', prompt: 'studio ghibli style, anime, warm colors, hand-drawn' },
  { id: 'anime', label: 'Anime', labelKo: '애니메이션', prompt: 'anime style, vibrant, manga illustration' },
  { id: 'illustration', label: 'Illustration', labelKo: '일러스트', prompt: 'digital illustration, artistic, colorful' },
  { id: 'pixel', label: 'Pixel Art', labelKo: '픽셀 아트', prompt: 'pixel art style, 16-bit, retro game' },
  { id: '3d', label: '3D Render', labelKo: '3D 렌더', prompt: '3D render, octane render, cinema 4d, smooth lighting' },
  { id: 'watercolor', label: 'Watercolor', labelKo: '수채화', prompt: 'watercolor painting, soft colors, artistic brush strokes' },
  { id: 'cyberpunk', label: 'Cyberpunk', labelKo: '사이버펑크', prompt: 'cyberpunk style, neon lights, futuristic, dark atmosphere' },
] as const;

export type StyleId = typeof IMAGE_STYLES[number]['id'];
