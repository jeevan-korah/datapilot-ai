import { processQuery } from "../services/queryService.js"

export const promptExtraction = async (req, res) => {
  try {
    const { prompt, schema, dbType } = req.body; // Add dbType if you want it configurable

    // Pass as an object, not separate arguments
    const result = await processQuery({
      prompt,
      schema,
      dbType : "postgressql" // optional, defaults to "postgresql"
    });

    res.status(200).json({
      success: true,
      message: "Query extracted successfully",
      prompt: prompt,
      sql: "The Generated Query is: " + result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error extracting query",
      error: error.message
    });
  }
};