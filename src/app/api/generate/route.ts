
import { NextResponse } from 'next/server';
import { ApiError, GoogleGenAI } from '@google/genai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// Tried in order. Flash-Lite is fast and has more free quota; Flash is the backup
// (each model has its own free tier quota, so a 429 on one does not affect the other)
const MODELS = ["gemini-3.5-flash-lite", "gemini-3.8-flash"];

const ai = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;

// Forces Gemini to answer with exactly this shape, so no markdown cleanup is needed
const suggestionsSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      name: { type: "string" },
      explanation: { type: "string" },
    },
    required: ["name", "explanation"],
  },
  minItems: 3,
  maxItems: 3,
};

// Gemini returns 503 when the model is temporarily overloaded; these usually clear within seconds
const RETRY_DELAYS_MS = [2000, 4000];

// An overloaded model can hang for minutes before failing, so cap each request
const REQUEST_TIMEOUT_MS = 15000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type GenerateParams = Parameters<GoogleGenAI['models']['generateContent']>[0];

const isOverloaded = (error: unknown) => error instanceof ApiError && error.status === 503;

const isQuotaExceeded = (error: unknown) => error instanceof ApiError && error.status === 429;

// The SDK also sends the timeout to Gemini (X-Server-Timeout), so the server usually
// answers 504 DEADLINE_EXCEEDED before the client-side abort fires
const isTimeout = (error: unknown) =>
  (error instanceof ApiError && error.status === 504) ||
  (error instanceof Error && error.name === 'AbortError');

async function generateWithRetry(client: GoogleGenAI, params: GenerateParams) {
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
}

async function generateWithFallback(client: GoogleGenAI, params: Omit<GenerateParams, 'model'>) {
  for (const [index, model] of MODELS.entries()) {
    try {
      return await generateWithRetry(client, { ...params, model });
    } catch (error) {
      const nextModel = MODELS[index + 1];
      // Timed-out or quota-exceeded models are not retried; they go straight to the next model
      const canFallBack = isOverloaded(error) || isTimeout(error) || isQuotaExceeded(error);
      if (!canFallBack || !nextModel) throw error;
      const reason = isTimeout(error) ? 'timed out' : isQuotaExceeded(error) ? 'quota exceeded' : 'still overloaded';
      console.warn(`${model} ${reason}, falling back to ${nextModel}`);
    }
  }
  throw new Error('No Gemini model configured');
}

export async function POST(req: Request) {
  try {
    if (!ai) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not set in .env.local' },
        { status: 500 }
      );
    }

    const { context, role, namingCase } = await req.json();

    if (!context || !role || !namingCase) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const prompt = `You are an expert developer assistant. Your task is to generate 3 high-quality, descriptive programming names based on the user's requirements.
The names MUST follow the specified naming convention.
Requirements:
- Role: ${role}
- Context/Description: ${context}
- Naming Convention: ${namingCase}

Please provide exactly 3 name suggestions. For each suggestion, provide a brief explanation (1 sentence) of why it's a good name.`;

    const response = await generateWithFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: suggestionsSchema,
        temperature: 0.7,
      },
    });

    const generatedText = response.text ?? "[]";

    try {
      const suggestions = JSON.parse(generatedText);
      return NextResponse.json({ suggestions });
    } catch {
      console.error('Failed to parse AI output as JSON:', generatedText);
      return NextResponse.json(
        { error: 'Failed to parse AI output. AI may not have returned valid JSON.' },
        { status: 500 }
      );
    }

  } catch (error) {
    if (isTimeout(error)) {
      console.error('Gemini request timed out on every model');
      return NextResponse.json(
        { error: 'AI service took too long to respond. Please try again later.' },
        { status: 504 }
      );
    }

    if (error instanceof ApiError) {
      console.error('Gemini API Error:', error.message);

      // Free tier quota used up; it resets on its own (daily quota at midnight Pacific time)
      if (isQuotaExceeded(error)) {
        return NextResponse.json(
          { error: 'Free quota exceeded. Please try again later.' },
          { status: 429 }
        );
      }

      // Every model stayed overloaded even after retries
      if (isOverloaded(error)) {
        return NextResponse.json(
          { error: 'AI service is overloaded. Please try again later.' },
          { status: 503 }
        );
      }

      // Return 502 Bad Gateway to differentiate upstream errors from our own
      return NextResponse.json(
        { error: `Gemini API Error (${error.status}): ${error.message}` },
        { status: 502 }
      );
    }

    console.error('Error in generate API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
