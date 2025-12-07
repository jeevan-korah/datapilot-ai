import express from "express";
import userRoutes from "./routes/userRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

app.use("/api/users", userRoutes);

// Start server

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
