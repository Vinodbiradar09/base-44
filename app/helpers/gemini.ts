import {GoogleGenAI} from "@google/genai";
import { systemPrompt } from "./prompt";
const apiKey = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({apiKey});

export async function gemini_response(code : string , onChunk : (chunk : string)=> void) {
   try {
     if (code.length > 500000) {
      throw new Error('Code is too long. Please provide code under 500,000 characters.');
    }

     const prompt = `${systemPrompt}\n\nCode to optimize and scale:\n\`\`\`\n${code}\n\`\`\``;

     const response = await ai.models.generateContentStream({
        model : "gemini-2.5-pro",
        contents : prompt,
        config : {
            temperature : 0.1,
            topP : 0.8,
            topK : 40,
            maxOutputTokens : 10000,
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
    console.log("full response" , fullResponse);
    return fullResponse;
   } catch (error) {
        console.log("Error while gemini streaming" , error);
        throw new Error("Gemini streaming error");
   }
}
