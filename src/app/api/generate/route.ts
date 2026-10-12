
import { NextResponse } from 'next/server';
import { ApiError, GoogleGenAI } from '@google/genai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-3.8-flash";

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

    const response = await ai.models.generateContent({
      model: MODEL,
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
    if (error instanceof ApiError) {
      console.error('Gemini API Error:', error.message);

      // Free tier quota used up; it resets on its own (daily quota at midnight Pacific time)
      if (error.status === 429) {
        return NextResponse.json(
          { error: 'Free quota exceeded. Please try again later.' },
          { status: 429 }
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
