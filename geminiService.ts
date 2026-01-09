
import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "./constants";

// Initialize the Gemini API client using the environment variable directly as required.
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeTask = async (input: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analiza esta indicación de tarea: "${input}"`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          subject: { type: Type.STRING },
          dueDate: { type: Type.STRING },
          summary: { type: Type.STRING },
          studyMaterial: { type: Type.STRING }
        },
        required: ["subject", "dueDate", "summary", "studyMaterial"]
      }
    },
  });

  try {
    // response.text is a property, not a function.
    const text = response.text;
    return JSON.parse(text || "{}");
  } catch (error) {
    console.error("Error parsing Gemini response:", error);
    throw new Error("No se pudo analizar la tarea correctamente.");
  }
};
