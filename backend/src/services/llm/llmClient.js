export const callLLM = async (prompt) => {
  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "mistral",
      prompt,
      stream: false
    })
  });

  if (!response.ok) {
    throw new Error("Failed to call Ollama");
  }

  const data = await response.json();

  return data.response.trim();
};