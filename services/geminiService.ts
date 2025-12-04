import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ArtAnalysis } from "../types";

// Define the schema for the Gemini response to ensure consistent JSON output
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    technicalScores: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING, description: "Categoría técnica (ej. Perspectiva, Teoría del Color, Anatomía, Sombreado, Composición)" },
          score: { type: Type.NUMBER, description: "Puntuación sobre 100" },
          fullMark: { type: Type.NUMBER, description: "Siempre 100" }
        },
        required: ["category", "score", "fullMark"]
      }
    },
    detectedPatterns: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Patrones visuales detectados (ej. 'Proporción Áurea', 'Composición Triangular', 'Colores Complementarios', 'Tramado')"
    },
    colorPalette: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Códigos hexadecimales de los colores dominantes detectados en la obra"
    },
    feedback: {
      type: Type.OBJECT,
      properties: {
        strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lista de fortalezas técnicas en español" },
        improvements: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lista de áreas de mejora en español" },
        tips: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Consejos prácticos para mejorar en español" }
      },
      required: ["strengths", "improvements", "tips"]
    },
    catCommentary: {
      type: Type.STRING,
      description: "Un comentario corto, ingenioso y en primera persona de la personalidad 'Gato Artista'. Alentador pero técnicamente estricto. Usa juegos de palabras sobre arte si es posible. Todo en Español."
    }
  },
  required: ["technicalScores", "detectedPatterns", "feedback", "catCommentary", "colorPalette"]
};

export const analyzeArtwork = async (base64Image: string, mimeType: string): Promise<ArtAnalysis> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Actúa como un Crítico de Arte Técnico e Instructor de clase mundial.
    Tu personalidad es la de un "Gato Artista" altamente calificado, un poco serio pero alentador (Maestro Michi).
    
    Analiza la imagen proporcionada específicamente por su ejecución técnica.
    Ignora el contexto cultural o el significado del tema. Céntrate ÚNICAMENTE en:
    1. Anatomía y Forma (si corresponde)
    2. Perspectiva y Profundidad
    3. Iluminación y Sombreado (Valores)
    4. Teoría del Color (Armonía, Saturación, Temperatura)
    5. Composición (Equilibrio, Puntos Focales, Movimiento Visual)
    6. Calidad de Línea (Peso, Confianza)

    Identifica patrones visuales específicos utilizados (por ejemplo, formas recurrentes, técnicas de pincelada específicas).
    Proporciona una paleta de colores hexadecimales de los colores dominantes.
    
    IMPORTANTE: Todo el texto de salida (feedback, tips, comentarios del gato) DEBE estar en ESPAÑOL (Castellano).
    
    Devuelve el resultado estrictamente en formato JSON según el esquema proporcionado.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.4, // Lower temperature for more objective technical analysis
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    return JSON.parse(text) as ArtAnalysis;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};