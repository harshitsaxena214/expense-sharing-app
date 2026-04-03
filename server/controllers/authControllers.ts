import bcrypt from "bcryptjs";
import db from "../lib/db.js";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { env } from "../lib/env.js";
import { AuthenticatedRequest } from "../types/authTypes.js";

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await db.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User Already Exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    const token = jwt.sign(
      {
        id: newUser.id,
      },
      env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error: any) {
    console.log("Error SigningUp User", error);
    return res.status(500).json({
      success: false,
      message: "Error Registering User",
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await db.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, messsage: "Invalid credentials" });
    }
    const token = jwt.sign(
      {
        id: user.id,
      },
      env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "User Logged In Successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error: any) {
    console.log("Error SigningUp User", error);
    return res.status(500).json({
      success: false,
      message: "Error Registering User",
    });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: env.NODE_ENV !== "development",
      sameSite: "strict",
    });
    res.status(200).json({
      success: true,
      message: "User Logged Out Successfully",
    });
  } catch (error) {
    console.error("Error Logging Out user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getCurrentUser = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User Fetched Successfully",
      user: req.user,
    });
  } catch (error) {
    console.error("Error Getting user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
