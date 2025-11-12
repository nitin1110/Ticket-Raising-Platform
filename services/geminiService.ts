
import { GoogleGenAI, Type } from "@google/genai";
import { TicketPriority } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const prioritySchema = {
  type: Type.OBJECT,
  properties: {
    priority: {
      type: Type.STRING,
      enum: [TicketPriority.Low, TicketPriority.Medium, TicketPriority.High],
      description: "The calculated priority of the support ticket."
    },
  },
  required: ["priority"],
};


export async function suggestPriority(title: string, description: string): Promise<TicketPriority> {
  const prompt = `
    Analyze the following support ticket and determine its priority level.
    Consider the urgency, impact on the user, and keywords used.
    
    Respond with one of three priority levels: Low, Medium, or High.
    - High: Critical issue, blocking functionality, security vulnerability. e.g., "Cannot login", "Website down", "Payment failing".
    - Medium: Significant issue, core feature is impaired but there might be a workaround. e.g., "Profile update not saving", "Export feature is slow".
    - Low: Minor issue, cosmetic bug, or question. e.g., "Typo on homepage", "How to change email notifications?".

    Ticket Title: "${title}"
    Ticket Description: "${description}"
  `;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: prioritySchema,
        },
      });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);

    if (result && result.priority && Object.values(TicketPriority).includes(result.priority)) {
      return result.priority as TicketPriority;
    } else {
      console.warn("Gemini response was not a valid priority, falling back to Medium.", result);
      return TicketPriority.Medium;
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Fallback in case of API error
    return TicketPriority.Medium;
  }
}
