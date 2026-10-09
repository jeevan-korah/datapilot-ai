import { buildSQLPrompt } from "./llm/promptEngineer.js";
import { callLLM } from "./llm/llmClient.js";

// Build an Error carrying an HTTP status + machine-readable code so the
// controller can distinguish user-fixable requests (400) from server faults (500).
const queryError = (message, code, status) => {
  const error = new Error(message);
  error.code = code;
  error.status = status;
  return error;
};

export const processQuery = async ({
  prompt,
  schema,
  dbType = "postgresql",
}) => {
  const llmPrompt = buildSQLPrompt({
    userPrompt: prompt,
    schema,
    dbType,
  });
  const rawResponse = await callLLM(llmPrompt);

  if (!rawResponse) {
    throw queryError(
      "Empty response from the language model",
      "LLM_EMPTY",
      500,
    );
  }

  // The model may wrap its answer in markdown fences; normalise before checks.
  const cleaned = rawResponse.replace(/```[a-z]*|```/gi, "").trim();

  if (/^INVALID_SCHEMA[\s.;!]*$/i.test(cleaned)) {
    throw queryError(
      "That request can't be answered using the connected database schema. Try rephrasing it using one of the available tables.",
      "INVALID_SCHEMA",
      400,
    );
  }

  let sql = cleaned.replace(/\s+/g, " ");

  // Read-only enforcement
  if (!/^SELECT\b/i.test(sql)) {
    throw queryError(
      "Only read-only SELECT queries are allowed.",
      "NOT_SELECT",
      400,
    );
  }

  // Semicolon enforcement
  if (!sql.endsWith(";")) {
    sql += ";";
  }

  return sql;
};
