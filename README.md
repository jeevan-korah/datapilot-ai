# Workflow on how Ollama interacts with the backend

### 🔄 Request Flow

1. **Client (Postman / Frontend)**
   - Sends `prompt`, `schema`, and `dbType` via `POST /api/users/query`

2. **Controller (`queryController.js`)**
   - Extracts request body
   - Calls the service layer (src/services/queryService.js)
   - Returns SQL or error response

3. **Service (`queryService.js`)**
   - Builds a strict LLM prompt
   - Calls the LLM client
   - Validates the SQL output

4. **Prompt Engineer (`promptEngineer.js`)**
   - Enforces schema-only SQL generation
   - Prevents assumptions and hallucinations
   - Forces single valid SQL or `INVALID_SCHEMA`(Ollama Output)

5. **LLM Client (`llmClient.js`)**
   - Sends prompt to Ollama (`http://localhost:11434`) -> yes it runs parallel with the backend server
   - Returns raw model output

6. **Ollama (LLM)**
   - Generates SQL based strictly on the provided schema

### 📊 Architecture Overview

Postman / Frontend
        │
        ▼
Express Route
        │
        ▼
queryController.js
        │
        ▼
queryService.js
        │
        ▼
promptEngineer.js
        │
        ▼
llmClient.js
        │
        ▼
Ollama (Mistral)
        │
        ▼
SQL Query / INVALID_SCHEMA
        │
        ▼
Controller → Client

