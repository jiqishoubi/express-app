import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Role } from "../modules/users/user.entity";

dotenv.config();

const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error("JWT_SECRET is not configured");
}

type TokenPayload = {
  id: number;
  email: string;
  role: Role;
};

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing authorization header" });
  }

  const token = header.slice(7); // 去掉 "Bearer " 前缀得到真实的令牌

  try {
    const payload = jwt.verify(token, secret) as TokenPayload; // 校验失败会抛出异常
    req.user = payload; // 将解析出的用户信息保存到 req，后续中间件可以直接使用
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const requireRole = (roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};
