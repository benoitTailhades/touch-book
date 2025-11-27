import { GoogleGenAI, Type } from "@google/genai";
import { Book } from "../types";

// Initialize Gemini with the API Key from environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchBookRecommendations = async (genre: string): Promise<Book[]> => {
  try {
    const prompt = `Génère une liste de 6 livres populaires et intéressants dans le genre "${genre || 'Littérature générale'}". 
    Pour chaque livre, fournis un titre, un auteur, une description courte mais captivante en français, et une estimation du nombre de pages en format braille.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING, description: "Un ID unique (slug)" },
              title: { type: Type.STRING },
              author: { type: Type.STRING },
              description: { type: Type.STRING },
              genre: { type: Type.STRING },
              brailleSize: { type: Type.STRING, description: "Estimation pages braille, ex: '300 pages'" },
            },
            required: ["id", "title", "author", "description", "genre", "brailleSize"],
          },
        },
      },
    });

    const text = response.text;
    if (!text) return [];
    
    return JSON.parse(text) as Book[];
  } catch (error) {
    console.error("Erreur lors de la récupération des livres:", error);
    throw error;
  }
};

export const simulateBrailleConversion = async (bookTitle: string): Promise<boolean> => {
  // Simulate network latency for conversion
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 2000);
  });
};