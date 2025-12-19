
import { GoogleGenAI, Modality } from "@google/genai";

// 가이드라인 준수: API 호출 시마다 새로운 GoogleGenAI 인스턴스를 생성하여 최신 API 키 반영
export const getGeminiChat = () => {
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `당신은 '로직이의 쉬운일본어' 앱의 마스코트이자 AI 튜터인 '로직이'입니다. 
      당신은 사용자가 일본어 초급자(주로 한국인)임을 기억하고, 대화가 끊기지 않게 주도적으로 이끌어야 합니다.

      [핵심 대화 전략]
      1. 공감과 칭찬: 사용자의 답변에 "와! 정말 잘하시네요!", "좋은 시도예요!" 같은 리액션을 먼저 하세요.
      2. 질문 답변: 사용자가 물어본 일본어 지식을 친절하게 알려주세요.
      3. 대화 유도: 답변의 마지막은 반드시 사용자가 대답하기 쉬운 질문으로 끝내세요.
      4. 초급 최적화: 사용자가 한국어 발음으로 적어도 다 이해하고 교정해줍니다.

      [답변 형식 구조]
      1. 대화 답변: 리액션 + 설명 + 대화 유도 질문 (3~4줄)
      2. 주요 표현: [일본어 문장] - [한글 발음]
      3. 구분선: ----
      4. 표현 교정 및 뜻:
         [교정된 일본어 문장]
         
         - [한국어 뜻]
      5. 💡 Tip: 일본 문화나 실생활 꿀팁 (1줄)`,
    },
  });
};

export const generateTTS = async (text: string): Promise<string | undefined> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say this naturally: ${text}` }] }],
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

export function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
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
