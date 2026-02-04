
import { GoogleGenAI, Modality, Type, GenerateContentResponse, LiveServerMessage } from "@google/genai";

/**
 * Service for Gemini AI integration
 * API Key is retrieved from process.env.API_KEY as per requirements.
 */

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  // Basic Text tasks with Lite for low latency
  async fastTextResponse(prompt: string): Promise<string> {
    const response = await this.ai.models.generateContent({
      // Use correct model name as per guidelines
      model: 'gemini-flash-lite-latest',
      contents: prompt,
    });
    return response.text || "No response";
  }

  // Complex reasoning with Thinking Mode
  async thinkComplex(prompt: string): Promise<string> {
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 }
      },
    });
    return response.text || "No reasoning available";
  }

  // Image editing with Nano Banana (Gemini 2.5 Flash Image)
  async editImage(base64Image: string, prompt: string, mimeType: string): Promise<string | null> {
    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: mimeType } },
          { text: prompt }
        ]
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  }

  // Video understanding with Gemini Pro
  async analyzeVideo(base64Video: string, prompt: string, mimeType: string): Promise<string> {
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Video, mimeType: mimeType } },
          { text: prompt }
        ]
      }
    });
    return response.text || "Could not analyze video";
  }

  // Maps Grounding for seminary locations and surrounding services
  async searchMaps(query: string, location?: { lat: number, lng: number }): Promise<{ text: string, links: any[] }> {
    const response = await this.ai.models.generateContent({
      // Maps grounding is only supported in Gemini 2.5 series models.
      model: "gemini-2.5-flash",
      contents: query,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: location ? {
            latLng: {
              latitude: location.lat,
              longitude: location.lng
            }
          } : undefined
        }
      },
    });

    return {
      text: response.text || "",
      links: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  }

  // Live Voice API Connection
  async connectVoice(callbacks: {
    onOpen?: () => void,
    onMessage?: (message: LiveServerMessage) => void,
    onError?: (e: any) => void,
    onClose?: () => void
  }) {
    return this.ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-12-2025',
      callbacks: {
        onopen: callbacks.onOpen || (() => {}),
        onmessage: callbacks.onMessage || (() => {}),
        onerror: callbacks.onError || (() => {}),
        onclose: callbacks.onClose || (() => {}),
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
        },
        systemInstruction: 'You are a helpful AI assistant for students at St. Paul’s Catholic Seminary. Be professional, respectful, and helpful.',
      },
    });
  }
}

export const gemini = new GeminiService();
