import express from "express";
import authRouter from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import groupRouter from "./routes/groupRoutes.js";
import expenseRouter from "./routes/expenseRoutes.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

const port = 8000;

// healthCheck
app.get("/", (req, res) => {
  res.send("Server is live");
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/groups", groupRouter);
app.use("/api/groups/:groupId/expenses", expenseRouter);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
