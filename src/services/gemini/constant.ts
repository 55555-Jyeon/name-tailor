// Tried in order. Flash-Lite is fast and has more free quota; Flash is the backup
// (each model has its own free tier quota, so a 429 on one does not affect the other)
export const MODELS = ["gemini-3.5-flash-lite", "gemini-3.8-flash"];

// Gemini returns 503 when the model is temporarily overloaded; these usually clear within seconds
export const RETRY_DELAYS_MS = [2000, 4000];

// An overloaded model can hang for minutes before failing, so cap each request
export const REQUEST_TIMEOUT_MS = 15000;

// Forces Gemini to answer with exactly this shape, so no markdown cleanup is needed.
// Explanations come in both languages so the language toggle needs no extra request.
export const SUGGESTIONS_SCHEMA = {
  type: "array",
  items: {
    type: "object",
    properties: {
      name: { type: "string" },
      explanationEn: { type: "string" },
      explanationKo: { type: "string" },
      words: {
        type: "array",
        items: {
          type: "object",
          properties: {
            word: { type: "string" },
            definitionEn: { type: "string" },
            definitionKo: { type: "string" },
          },
          required: ["word", "definitionEn", "definitionKo"],
        },
      },
    },
    required: ["name", "explanationEn", "explanationKo", "words"],
  },
  minItems: 3,
  maxItems: 3,
};
