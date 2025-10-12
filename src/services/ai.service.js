import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();    

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

async function generateResponse(content) {
  const response = await ai.models.generateContent({ //  generateContent returns a response object 
    model: "gemini-2.0-flash",
    contents: content,
  });
  return response.text; // return the generated text response from AI 
}

export { generateResponse };
