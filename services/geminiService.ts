import { GoogleGenAI, Chat } from "@google/genai";
import { INITIAL_SYSTEM_INSTRUCTION } from '../constants';

// Deep linking navigation and brand logic is now centralized in constants.ts

let chatSession: Chat | null = null;

export const getChatSession = (): Chat => {
  if (chatSession) return chatSession;

  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
  chatSession = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: INITIAL_SYSTEM_INSTRUCTION,
      temperature: 0.4,
    },
  });
  return chatSession;
};

export const sendMessageStream = async (message: string) => {
  const chat = getChatSession();
  return await chat.sendMessageStream({ message });
};