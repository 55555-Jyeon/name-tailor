import type { GoogleGenAI } from '@google/genai';

export type GenerateParams = Parameters<GoogleGenAI['models']['generateContent']>[0];
