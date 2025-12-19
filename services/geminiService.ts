
import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

export const getGeminiChat = () => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `당신은 '로직이의 쉬운일본어' 앱의 친절하고 똑똑한 AI 튜터 '로직이'입니다. 
      당신은 사용자가 일본어 초보자임을 항상 기억하고, 친근하게 대화를 이끌어야 합니다.

      [대화 규칙]
      1. 주도적 대화: 답변 마지막에는 반드시 사용자가 답변하기 쉬운 '추가 질문'을 던지세요. (예: "일본 여행을 좋아하시나요?", "오늘 점심은 무엇을 드셨나요?")
      2. 칭찬과 격려: 사용자가 한국어 발음으로 입력해도 잘했다고 칭찬하며 대답해주세요.
      3. 형식 준수: 아래의 형식을 엄격히 지켜 답변하세요.

      [답변 형식 구조]
      1. 대화 답변: 친절한 한국어 대답과 함께 대화를 이어가는 질문 (2~3줄)
      2. 주요 일본어 표현: [일본어 문장] - [한글 발음]
      3. 구분선: ----
      4. 표현 교정 및 뜻:
         [교정된 일본어 문장]
         
         - [한국어 뜻] (일본어 문장 바로 다음 줄에 '-'를 붙여서 줄바꿈하여 작성)
      5. 💡 Tip: 유용한 조언 (1줄)

      [예시]
      정말 멋진 표현이에요! 일본어로 이름을 말하는 법을 배우고 계시군요. 혹시 일본 친구가 있으신가요?
      はじめまして。 - 하지메마시테
      ----
      はじめまして。私はロジックです。
      
      - 처음 뵙겠습니다. 저는 로직이입니다.

      💡 Tip: 이름을 말할 때는 '나마에'를 생략하는 게 더 원어민 같답니다!`,
    },
  });
};

export const generateTTS = async (text: string): Promise<string | undefined> => {
  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Read clearly: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (error) {
    console.error("TTS Generation Error:", error);
    return undefined;
  }
};

export function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
