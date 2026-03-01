// ============================================
// Google Gemini API (Nano Banana) 이미지 생성
// ============================================

import { GoogleGenerativeAI } from '@google/generative-ai';
import { IMAGE_STYLES, type StyleId } from './types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// 스타일별 프롬프트 강화
function enhancePrompt(userPrompt: string, styleId: StyleId): string {
  const style = IMAGE_STYLES.find((s) => s.id === styleId);
  const stylePrompt = style ? style.prompt : '';

  return `${userPrompt}. ${stylePrompt}. masterpiece, best quality, highly detailed`;
}

export async function generateImage(
  userPrompt: string,
  styleId: StyleId
): Promise<{ success: boolean; imageBase64?: string; error?: string }> {
  try {
    const enhancedPrompt = enhancePrompt(userPrompt, styleId);

    // Gemini 2.0 Flash preview image generation model
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp-image-generation',
      generationConfig: {
        // @ts-ignore - 이미지 생성을 위한 설정
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    const result = await model.generateContent(enhancedPrompt);
    const response = result.response;

    // 응답에서 이미지 파트 추출
    if (response.candidates && response.candidates[0]) {
      const parts = response.candidates[0].content.parts;

      for (const part of parts) {
        // @ts-ignore - inlineData 타입이 SDK에 없을 수 있음
        if (part.inlineData) {
          // @ts-ignore
          const base64 = part.inlineData.data;
          // @ts-ignore
          const mimeType = part.inlineData.mimeType || 'image/png';
          return {
            success: true,
            imageBase64: `data:${mimeType};base64,${base64}`,
          };
        }
      }
    }

    return {
      success: false,
      error: 'No image was generated. Try a different prompt.',
    };
  } catch (error: any) {
    console.error('Gemini API Error:', error);

    // 에러 종류별 메시지
    if (error.message?.includes('SAFETY')) {
      return {
        success: false,
        error: 'Your prompt was blocked by safety filters. Please try a different prompt.',
      };
    }

    if (error.message?.includes('quota') || error.message?.includes('429')) {
      return {
        success: false,
        error: 'API rate limit reached. Please try again in a moment.',
      };
    }

    if (error.message?.includes('API_KEY')) {
      return {
        success: false,
        error: 'Server configuration error. Please contact support.',
      };
    }

    return {
      success: false,
      error: 'Failed to generate image. Please try again.',
    };
  }
}
