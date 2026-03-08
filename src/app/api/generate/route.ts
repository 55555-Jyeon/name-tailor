
import { NextResponse } from 'next/server';

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
const MODEL_URL = "https://router.huggingface.co/v1/chat/completions";

export async function POST(req: Request) {
  try {
    const { context, role, namingCase } = await req.json();

    if (!context || !role || !namingCase) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      ); 
    }

    const prompt = `[INST] You are an expert developer assistant. Your task is to generate 3 high-quality, descriptive programming names based on the user's requirements. 
The names MUST follow the specified naming convention.
Requirements:
- Role: ${role}
- Context/Description: ${context}
- Naming Convention: ${namingCase}

Please provide exactly 3 name suggestions. For each suggestion, provide a brief explanation (1 sentence) of why it's a good name.
Format the output EXACTLY as a JSON array of objects with "name" and "explanation" keys.
Do not output any markdown formatting around the JSON, just the raw JSON. Example:
[
  {"name": "userName", "explanation": "Clear and concise."},
  {"name": "fetchUserProfile", "explanation": "Describes the action clearly."}
]
[/INST]`;

const response = await fetch(MODEL_URL, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${HF_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
  model: "meta-llama/Meta-Llama-3-8B-Instruct",
  messages: [
    {
      role: "user",
      content: prompt
    }
  ],
  max_tokens: 300,
  temperature: 0.7
})
});

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Hugging Face API Error:', errorText);
      // Return 502 Bad Gateway to differentiate from our own 404
      return NextResponse.json(
        { error: `Hugging Face API Error (${response.status}): ${errorText}` },
        { status: 502 }
      );
    }

  const result = await response.json();
  let generatedText = result.choices?.[0]?.message?.content || "[]";
    
    // Attempt to parse JSON
    try {
      // Clean up potential markdown formatting
      generatedText = generatedText.replace(/```json/g, '').replace(/```/g, '').trim();
      const suggestions = JSON.parse(generatedText);
      return NextResponse.json({ suggestions });
    } catch (parseError) {
      console.error('Failed to parse AI output as JSON:', generatedText);
      return NextResponse.json(
        { error: 'Failed to parse AI output. AI may not have returned valid JSON.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error in generate API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
