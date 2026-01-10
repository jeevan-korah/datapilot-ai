export const formatSchemaForLLM = (schema) => {
  if (!schema || !schema.tables || schema.tables.length === 0) {
    return "No schema available";
  }

  // Ensure tables is an array
  const tables = Array.isArray(schema.tables) ? schema.tables : [];

  let formatted = "";

  for (const table of tables) {
    // Skip if no table name
    if (!table.name) continue;

    formatted += `\nTABLE: ${table.name}\n`;

    if (table.description) {
      formatted += `  Description: ${table.description}\n`;
    }

    formatted += `  Columns:\n`;

    // Ensure columns is an array
    const columns = Array.isArray(table.columns) ? table.columns : [];

    for (const column of columns) {
      const colName = column.name || column.column_name;
      const colType = column.type || column.data_type;

      // Skip if no column name
      if (!colName) continue;

      const nullable =
        column.nullable !== undefined
          ? column.nullable
          : column.is_nullable === "YES";

      formatted += `    - ${colName}`;

      if (colType) {
        formatted += ` (${colType})`;
      }

      if (!nullable) {
        formatted += ` NOT NULL`;
      }

      if (column.description) {
        formatted += ` // ${column.description}`;
      }

      formatted += `\n`;
    }

    // Add primary keys
    if (table.primaryKeys) {
      const pkArray = Array.isArray(table.primaryKeys)
        ? table.primaryKeys
        : [table.primaryKeys];
      if (pkArray.length > 0) {
        formatted += `  Primary Key: ${pkArray.join(", ")}\n`;
      }
    }

    // Add foreign keys with relationships
    if (table.foreignKeys) {
      const fkArray = Array.isArray(table.foreignKeys) ? table.foreignKeys : [];
      if (fkArray.length > 0) {
        formatted += `  Foreign Keys:\n`;
        for (const fk of fkArray) {
          formatted += `    - ${fk.column} -> ${fk.referencesTable}.${fk.referencesColumn}`;
          if (fk.onDelete) {
            formatted += ` (ON DELETE ${fk.onDelete})`;
          }
          formatted += `\n`;
        }
      }
    }

    // Add relationships (for manual schemas)
    if (table.relationships) {
      const relArray = Array.isArray(table.relationships)
        ? table.relationships
        : [];
      if (relArray.length > 0) {
        formatted += `  Relationships:\n`;
        for (const rel of relArray) {
          formatted += `    - ${rel.type}: ${rel.relatedTable}`;
          if (rel.foreignKey) {
            formatted += ` via ${rel.foreignKey}`;
          }
          if (rel.description) {
            formatted += ` (${rel.description})`;
          }
          formatted += `\n`;
        }
      }
    }

    formatted += `\n`;
  }

  return formatted.trim();
};

export const buildSQLPrompt = ({
  userPrompt,
  dbType = "postgresql",
  schema,
}) => {
  const formattedSchema = formatSchemaForLLM(schema);
  const dbUpper = dbType.toUpperCase();

  console.log(formattedSchema);

  return `You are a SQL query generator. Your ONLY job is to generate valid SQL queries.

═══════════════════════════════════════════════════════════════
CRITICAL RULES - VIOLATION WILL RESULT IN FAILURE:
═══════════════════════════════════════════════════════════════

1. TABLE AND COLUMN NAMES:
   - You MUST use EXACT table names as listed below
   - You MUST use EXACT column names as listed below
   - Table names are CASE-SENSITIVE
   - Column names are CASE-SENSITIVE
   - DO NOT invent, assume, or guess any table or column names
   - DO NOT use table names that are not in the schema below

2. SCHEMA COMPLETENESS:
   - The schema below is COMPLETE and EXHAUSTIVE
   - If a table is not listed, it does NOT exist
   - If a column is not listed, it does NOT exist
   - If you cannot answer the request with the provided schema,
     return EXACTLY this text: INVALID_SCHEMA

3. OUTPUT FORMAT:
   - Generate ONLY the SQL query
   - Start with SELECT (read-only queries only)
   - End with a semicolon (;)
   - NO explanations, NO markdown, NO comments
   - NO code blocks, NO backticks
   - Just the raw SQL query

4. SQL REQUIREMENTS:
   - Must be valid ${dbUpper} syntax
   - Must accurately answer the user's request
   - Use proper JOINs when referencing multiple tables
   - Use foreign key relationships listed below for joins
   - Use LIMIT clause for "top N" or "first N" queries
5. AGGREGATION RULES:
   - If SELECT includes aggregate functions (COUNT, SUM, AVG, MIN, MAX):
     - Every non-aggregated selected column MUST appear in GROUP BY
   - Do NOT rely on implicit grouping
   - If grouping would cause row multiplication due to multiple one-to-many joins,
     use correlated subqueries instead of GROUP BY

6. COUNT SEMANTICS:
   - When the request asks for "number of X per Y", counts MUST reflect
     the number of distinct X entities
   - Do NOT count rows produced by joining multiple one-to-many tables
   - Prefer COUNT(*) in correlated subqueries scoped to a single table

7. JOIN PATH VALIDATION:
   - Joins MUST follow explicit foreign key relationships from the schema
   - Do NOT join tables unless a direct foreign key exists
   - If no direct foreign key exists, join through the intermediate table
   - NEVER join columns with different semantic meaning
     (e.g., company_id to user_id)

8. MULTI-METRIC QUERIES:
   - When returning multiple aggregated metrics per primary entity:
     - Use correlated subqueries OR
     - Pre-aggregate each metric separately before joining
   - Do NOT aggregate across multiple fan-out joins in a single SELECT

═══════════════════════════════════════════════════════════════
DATABASE SCHEMA (${dbUpper}):
═══════════════════════════════════════════════════════════════

${formattedSchema}

═══════════════════════════════════════════════════════════════
AVAILABLE TABLES (use EXACTLY these names):
${schema.tables.map((t) => `  - ${t.name}`).join("\n")}
═══════════════════════════════════════════════════════════════

USER REQUEST:
"${userPrompt}"

GENERATE SQL QUERY:
`.trim();
};
