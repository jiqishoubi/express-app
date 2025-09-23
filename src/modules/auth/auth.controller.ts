import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { registerUser, validateUserCredentials } from "../users/user.service";
import { Role } from "../users/user.entity";

dotenv.config();

const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error("JWT_SECRET is not configured");
}

const createToken = (payload: { id: number; email: string; role: Role }) =>
  jwt.sign(payload, secret, { expiresIn: "12h" }); // 签发一个有效期 12 小时的登录令牌

export const authController = {
  async register(req: Request, res: Response) {
    const user = await registerUser({
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
      role: req.body.role
    });
    const token = createToken({ id: user.id, email: user.email, role: user.role });
    res.status(201).json({ user, token });
  },

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const user = await validateUserCredentials(email, password);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = createToken({ id: user.id, email: user.email, role: user.role });
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      token
    });
  }
};
