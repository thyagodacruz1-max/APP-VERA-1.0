
import { GoogleGenAI } from "@google/genai";

// ==================================================================
// POR FAVOR, COLOQUE SUA CHAVE DE API DO GEMINI AQUI
// 1. Obtenha sua chave em https://ai.google.dev/
// 2. Substitua a string "COLOQUE_SUA_CHAVE_DE_API_AQUI" pela sua chave.
// ==================================================================
const API_KEY = "AIzaSyCA3dMuouYfUFWM6nONsRG6CJkI0DNK_Bg";

// --- Não modifique abaixo desta linha ---

let ai;
try {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} catch (error) {
  console.error("Erro ao inicializar GoogleGenAI. Verifique a chave de API.", error);
}

export const runGemini = async (prompt: string) => {
  if (API_KEY === "COLOQUE_SUA_CHAVE_DE_API_AQUI") {
    throw new Error("API Key não configurada. Por favor, adicione sua chave de API no arquivo lib/gemini.ts");
  }

  if (!ai) {
     throw new Error("A instância do GoogleGenAI não foi inicializada. Verifique a chave de API.");
  }
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Erro ao chamar a API do Gemini:", error);
    throw new Error("Falha ao comunicar com o assistente de IA. Verifique o console para mais detalhes.");
  }
};
