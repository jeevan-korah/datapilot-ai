import Groq from "groq-sdk";

// Model is configurable so it can be swapped without a code change when Groq
// retires a model (e.g. llama-3.3-70b-versatile was decommissioned).
const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const callLLM = async (prompt) => {
  const response = await groq.chat.completions.create({
    model: GROQ_MODEL,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0,
  });

  // Reasoning models (like openai/gpt-oss-120b) return a `reasoning` field
  // alongside `content`; guard against a missing/empty final answer.
  const content = response.choices?.[0]?.message?.content;
  return (content ?? "").trim();
};
