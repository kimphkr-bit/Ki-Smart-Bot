import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

let chatSession: Chat | null = null;

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing from environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const initializeChat = () => {
  const ai = getAiClient();
  if (!ai) return null;

  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
    },
  });
  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  try {
    if (!chatSession) {
      initializeChat();
    }

    if (!chatSession) {
      throw new Error("Failed to initialize chat session.");
    }

    const response: GenerateContentResponse = await chatSession.sendMessage({ message });
    return response.text || "죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "죄송합니다. 시스템 문제로 응답할 수 없습니다. 상단의 연락처로 직접 문의 부탁드립니다.";
  }
};
