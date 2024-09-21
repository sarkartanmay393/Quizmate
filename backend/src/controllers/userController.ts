import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  try {
    if (!name || !email || !password || !role) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    if (role !== "admin" && role !== "interviewee") {
      res.status(400).json({ error: "Invalid role" });
      return;
    }

    if (!email.includes("@")) {
      res.status(400).json({ error: "Invalid email" });
      return;
    }

    if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
      res.status(400).json({ error: "Invalid password" });
      return;
    }

    const userExists = await prisma.user.findFirst({
      where: { email },
    });

    if (userExists) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });
    res.status(201).json({ newUser });
  } catch (error) {
    res.status(500).json({ error: "Failed to create user", verbose: JSON.stringify(error) });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    if (!email.includes("@")) {
      res.status(400).json({ error: "Invalid email" });
      return;
    }

    if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
      res.status(400).json({ error: "Invalid password" });
      return;
    }

    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      res.status(401).json({ error: "Incorrect password" });
      return;
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "4h",
      });

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ error: "Failed to login user" });
  }
};