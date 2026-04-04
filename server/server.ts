import express from "express";
import authRouter from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import groupRouter from "./routes/groupRoutes.js";
import expenseRouter from "./routes/expenseRoutes.js";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

const port = 8000;

// healthCheck
app.get("/", (req, res) => {
  res.send("Server is live");
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/groups", groupRouter);
app.use("/api/groups/:groupId/expenses", expenseRouter);

if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => console.log(`Server running on port ${port}`));
}

export default app;
