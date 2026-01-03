import express from "express";
import userRoutes from "./routes/userRoutes.js";
import cors from "cors";
import queryRoutes from "./routes/queryRoutes.js";

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
  res.json({ status: "OK", message: "Server is running" });
});

app.use("/api/users", userRoutes);
app.use("/api", queryRoutes);

// Start server

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
