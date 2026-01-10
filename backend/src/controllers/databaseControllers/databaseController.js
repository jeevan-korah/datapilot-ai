import { prisma } from "../../lib/prisma.js";
import {
  closeDatabaseConnection,
  introspectSchemaDetailed,
  maskConnectionString,
  testDatabaseConnection,
} from "../../utils/databaseHelper.js";
import {
  decryptConnectionString,
  encryptConnectionString,
} from "../../utils/encryption.js";

// Create database connection with MANUAL schema input
export const createConnectionManual = async (req, res) => {
  try {
    const {
      connectionString,
      dbType = "POSTGRESQL",
      schemaDefinition,
    } = req.body;
    const companyId = req.user.companyId;

    // Validation
    if (!connectionString) {
      return res.status(400).json({
        success: false,
        message: "Connection string is required",
      });
    }

    if (
      !schemaDefinition ||
      !schemaDefinition.tables ||
      !Array.isArray(schemaDefinition.tables)
    ) {
      return res.status(400).json({
        success: false,
        message: "Schema definition is required and must include tables array",
      });
    }

    // Validate schema structure - FUNCTION NOT DEFINED
    // const validationError = validateManualSchema(schemaDefinition);
    // if (validationError) {
    //   return res.status(400).json({
    //     success: false,
    //     message: validationError,
    //   });
    // }

    // Check if connection already exists for this company (ONE per company rule)
    const existingConnection = await prisma.databaseConnection.findFirst({
      where: { companyId },
    });

    if (existingConnection) {
      return res.status(400).json({
        success: false,
        message:
          "A database connection already exists for your company. Please delete it first or use update.",
      });
    }

    // Test connection first
    const testResult = await testDatabaseConnection(connectionString, dbType);
    if (!testResult.success) {
      return res.status(400).json({
        success: false,
        message: "Connection test failed",
        error: testResult.error,
      });
    }

    // Encrypt connection string
    const encryptedConnectionString = encryptConnectionString(connectionString);

    // Create database connection record with manual schema
    const dbConnection = await prisma.databaseConnection.create({
      data: {
        companyId,
        dbType,
        connectionString: encryptedConnectionString,
        // connectionString,
        schemaSnapshot: {
          method: "manual",
          ...schemaDefinition,
          createdAt: new Date().toISOString(),
        },
        lastVerifiedAt: new Date(),
      },
    });

    // Close test connection
    await closeDatabaseConnection(connectionString, dbType);

    res.status(201).json({
      success: true,
      message:
        "Database connection created successfully with manual schema definition",
      data: {
        id: dbConnection.id,
        method: "manual",
        dbType: dbConnection.dbType,
        createdAt: dbConnection.createdAt,
        lastVerifiedAt: dbConnection.lastVerifiedAt,
        isActive: dbConnection.isActive,
        tablesCount: schemaDefinition.tables?.length || 0,
        connectionStatus: "Connected",
      },
    });
  } catch (error) {
    console.error("Create Connection Manual Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating database connection",
    });
  }
};

// Create database connection with AUTOMATIC schema introspection
export const createConnectionAutomatic = async (req, res) => {
  try {
    const { connectionString, dbType = "POSTGRESQL" } = req.body;
    const companyId = req.user.companyId;

    // Validation
    if (!connectionString) {
      return res.status(400).json({
        success: false,
        message: "Connection string is required",
      });
    }

    // Check if connection already exists for this company (ONE per company rule)
    const existingConnection = await prisma.databaseConnection.findFirst({
      where: { companyId },
    });

    if (existingConnection) {
      return res.status(400).json({
        success: false,
        message:
          "A database connection already exists for your company. Please delete it first or use update.",
      });
    }

    // Test connection first
    const testResult = await testDatabaseConnection(connectionString, dbType);
    if (!testResult.success) {
      return res.status(400).json({
        success: false,
        message: "Connection test failed",
        error: testResult.error,
      });
    }

    // Automatically introspect schema with enhanced details (FK, PK, etc.)
    const schemaResult = await introspectSchemaDetailed(
      connectionString,
      dbType
    );

    if (!schemaResult.success) {
      return res.status(400).json({
        success: false,
        message: "Failed to introspect database schema",
        error: schemaResult.error,
      });
    }

    console.log(schemaResult);

    // Encrypt connection string
    const encryptedConnectionString = encryptConnectionString(connectionString);

    // Create database connection record
    const dbConnection = await prisma.databaseConnection.create({
      data: {
        companyId,
        dbType,
        connectionString: encryptedConnectionString,
        schemaSnapshot: {
          method: "automatic",
          ...schemaResult.schema,
        },
        lastVerifiedAt: new Date(),
      },
    });

    // Close test connection
    await closeDatabaseConnection(connectionString, dbType);

    res.status(201).json({
      success: true,
      message:
        "Database connection created successfully with automatic schema introspection",
      data: {
        id: dbConnection.id,
        method: "automatic",
        dbType: dbConnection.dbType,
        createdAt: dbConnection.createdAt,
        lastVerifiedAt: dbConnection.lastVerifiedAt,
        isActive: dbConnection.isActive,
        tablesCount: schemaResult.schema.tables?.length || 0,
        foreignKeysDetected: schemaResult.schema.totalForeignKeys || 0,
        connectionStatus: "Connected",
      },
    });
  } catch (error) {
    console.error("Create Connection Automatic Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating database connection",
    });
  }
};

// Get connection for company (only ONE connection per company)
export const getConnection = async (req, res) => {
  try {
    const companyId = req.user.companyId;

    const connection = await prisma.databaseConnection.findFirst({
      where: { companyId },
    });

    if (!connection) {
      return res.status(404).json({
        success: false,
        message: "No database connection found for your company",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: connection.id,
        method: connection.schemaSnapshot?.method || "unknown",
        dbType: connection.dbType,
        createdAt: connection.createdAt,
        lastVerifiedAt: connection.lastVerifiedAt,
        isActive: connection.isActive,
        schemaSnapshot: connection.schemaSnapshot,
        connectionStringPreview: maskConnectionString(
          decryptConnectionString(connection.connectionString)
        ),
      },
    });
  } catch (error) {
    console.error("Get Connection Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching connection",
    });
  }
};
