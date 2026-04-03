import express from "express";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/authControllers.js";
import { validate } from "../middlewares/validate.js";
import { signUpSchema, loginSchema } from "../schemas/authSchema.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const authRouter = express.Router();

authRouter.post("/register", validate(signUpSchema), registerUser);
authRouter.post("/login", validate(loginSchema), loginUser);
authRouter.post("/logout", authMiddleware, logoutUser);
authRouter.get("/getme", authMiddleware, getCurrentUser);

export default authRouter;
