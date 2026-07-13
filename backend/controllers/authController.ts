import { Request, Response } from "express";
import prisma from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

// ================= SIGNUP =================
export const signup = async (
  req: Request,
  res: Response
): Promise<Response | void> => {

  console.log(req.headers["content-type"]);
  console.log(req.body);
  try {
    const { name, email, password, mobile } = req.body;

    console.log("req.body ==========> ", req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        mobile: mobile,
        password: hashedPassword,
      },
    });

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {

    console.log("Error ===> ", error);

    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    return res.status(500).json({ message });
  }
};

// ================= SIGNIN =================
export const signin = async (
  req: Request,
  res: Response
): Promise<Response | void> => {

  console.log("JWT_SECRET ========> ", JWT_SECRET);
  try {
    const { identifier, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { mobile: identifier }
        ]
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      },
      JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.json({
      message: "Login successful",
      success: true,
      token,
      user:user
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    return res.status(500).json({ message });
  }
};

// ================= LOGOUT =================
export const logout = async (
  _req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    return res.json({
      message: "Logged out successfully",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    return res.status(500).json({ message });
  }
};



