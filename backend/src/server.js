import express from "express";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
import queryRoutes from "./routes/queryRoutes.js";
import databaseRoutes from "./routes/databaseRoutes.js";
import employeeManagementRoutes from "./routes/employeeManagementRoutes.js";
import roleManagementRoutes from "./routes/roleManagementRoutes.js";

const app = express();
const PORT = process.env.PORT || 5050;

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://mini-project-woad-eight.vercel.app",
    ],
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/query", queryRoutes);
app.use("/api/database", databaseRoutes);
app.use("/api/admin/employee-management",employeeManagementRoutes);
app.use("/api/admin/role-management",roleManagementRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Start server

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
