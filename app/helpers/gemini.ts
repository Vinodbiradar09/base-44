import {GoogleGenAI} from "@google/genai";
import { systemPrompt } from "./prompt";
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set in environment variables");
}

const ai = new GoogleGenAI({apiKey});

export async function gemini_response(code : string , onChunk : (chunk : string)=> void) : Promise<string> {
   try {
    if (typeof code !== "string") {
      throw new Error("Code must be a string");
    }
    code = code.trim();
    if (!code || code.length === 0) {
      throw new Error("Code is required for optimization");
    }
    if (code.length > 500000) {
      throw new Error("Code is too long. Please provide code under 500,000 characters.");
    }

     const prompt = `${systemPrompt}\n\nCode to optimize and scale:\n\`\`\`\n${code}\n\`\`\``;

     const response = await ai.models.generateContentStream({
        model: "gemini-2.5-flash",
        contents : prompt,
        config : {
            temperature : 0.1,
            topP : 0.8,
            topK : 40,
            maxOutputTokens : 32000,
        }
    })
    let fullResponse = '';
    let chunkCount = 0;
    for await (const chunk of response){
        chunkCount++;
        const chunkText = chunk.text
        fullResponse += chunkText;
        onChunk(chunkText || "");
        if (chunkCount % 5 === 0) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }
     if (fullResponse.trim().length === 0) {
      throw new Error('Empty response from Gemini');
    }
    return fullResponse;
   } catch (error) {
        console.log("Error while gemini streaming" , error);
        throw new Error("Gemini streaming error");
   }
}
