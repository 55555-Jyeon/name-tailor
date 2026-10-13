import { ApiError, GoogleGenAI } from '@google/genai';
import { MODELS, REQUEST_TIMEOUT_MS, RETRY_DELAYS_MS, SUGGESTIONS_SCHEMA } from './constant';
import type { GeminiSuggestion, GenerateParams } from './type';
import type { NameRequest, NameSuggestion } from '@/types/name';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;

const isGeminiConfigured = ai !== null;

// Thrown when Gemini answers with something that is not the expected JSON
class InvalidOutputError extends Error {
  constructor(public output: string) {
    super('Failed to parse AI output as JSON');
    this.name = 'InvalidOutputError';
  }
}

const isOverloaded = (error: unknown) => error instanceof ApiError && error.status === 503;

const isQuotaExceeded = (error: unknown) => error instanceof ApiError && error.status === 429;

// The SDK also sends the timeout to Gemini (X-Server-Timeout), so the server usually
// answers 504 DEADLINE_EXCEEDED before the client-side abort fires
const isTimeout = (error: unknown) =>
  (error instanceof ApiError && error.status === 504) ||
  (error instanceof Error && error.name === 'AbortError');

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const generateWithRetry = async (client: GoogleGenAI, params: GenerateParams) => {
  for (let attempt = 0; ; attempt++) {
    try {
      return await client.models.generateContent({
        ...params,
        config: { ...params.config, httpOptions: { timeout: REQUEST_TIMEOUT_MS } },
      });
    } catch (error) {
      if (!isOverloaded(error) || attempt >= RETRY_DELAYS_MS.length) throw error;
      console.warn(`${params.model} overloaded, retrying in ${RETRY_DELAYS_MS[attempt]}ms`);
      await sleep(RETRY_DELAYS_MS[attempt]);
    }
  }
};

// Only called for errors that can fall back: a timeout, used-up quota or an overload
const getFallbackReason = (error: unknown) => {
  if (isTimeout(error)) return 'timed out';
  if (isQuotaExceeded(error)) return 'quota exceeded';
  return 'still overloaded';
};

const generateWithFallback = async (client: GoogleGenAI, params: Omit<GenerateParams, 'model'>) => {
  for (const [index, model] of MODELS.entries()) {
    try {
      return await generateWithRetry(client, { ...params, model });
    } catch (error) {
      const nextModel = MODELS[index + 1];
      // Timed-out or quota-exceeded models are not retried; they go straight to the next model
      const canFallBack = isOverloaded(error) || isTimeout(error) || isQuotaExceeded(error);
      if (!canFallBack || !nextModel) throw error;
      console.warn(`${model} ${getFallbackReason(error)}, falling back to ${nextModel}`);
    }
  }
  throw new Error('No Gemini model configured');
};

const buildPrompt = ({ context, role, namingCase }: NameRequest) =>
  `You are an expert developer assistant. Your task is to generate 3 high-quality, descriptive programming names based on the user's requirements.
The names MUST follow the specified naming convention.
Requirements:
- Role: ${role}
- Context/Description: ${context}
- Naming Convention: ${namingCase}

Please provide exactly 3 name suggestions. For each suggestion, explain in one sentence why it's a good name,
once in English (explanationEn) and once in natural Korean (explanationKo). Keep the names themselves in English.
Also split each name into the words it is built from (words), in the order they appear and spelled as they appear in the name.
For each word give a short dictionary-style meaning of a few words, in English (definitionEn) and in Korean (definitionKo).`;

const generateNameSuggestions = async (request: NameRequest): Promise<NameSuggestion[]> => {
  if (!ai) throw new Error('GEMINI_API_KEY is not set');

  const response = await generateWithFallback(ai, {
    contents: buildPrompt(request),
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: SUGGESTIONS_SCHEMA,
      temperature: 0.7,
    },
  });

  const generatedText = response.text ?? "[]";

  let parsed: GeminiSuggestion[];
  try {
    parsed = JSON.parse(generatedText);
  } catch {
    throw new InvalidOutputError(generatedText);
  }

  return parsed.map(({ name, explanationEn, explanationKo, words }) => ({
    name,
    explanation: explanationEn,
    explanationKo,
    words: words.map(({ word, definitionEn, definitionKo }) => ({
      word,
      definition: definitionEn,
      definitionKo,
    })),
  }));
};

export {
  generateNameSuggestions,
  isGeminiConfigured,
  InvalidOutputError,
  isOverloaded,
  isQuotaExceeded,
  isTimeout,
};
