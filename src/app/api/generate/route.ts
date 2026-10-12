import { NextResponse } from 'next/server';
import { ApiError } from '@google/genai';
import {
  generateNameSuggestions,
  InvalidOutputError,
  isGeminiConfigured,
  isOverloaded,
  isQuotaExceeded,
  isTimeout,
} from '@/services/gemini';

const POST = async (req: Request) => {
  try {
    if (!isGeminiConfigured) {
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

    const suggestions = await generateNameSuggestions({ context, role, namingCase });
    return NextResponse.json({ suggestions });

  } catch (error) {
    if (error instanceof InvalidOutputError) {
      console.error('Failed to parse AI output as JSON:', error.output);
      return NextResponse.json(
        { error: 'Failed to parse AI output. AI may not have returned valid JSON.' },
        { status: 500 }
      );
    }

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
};

export { POST };
