import { Request, Response, NextFunction } from "express";

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err); // 打印错误日志，便于在开发阶段排查问题
  const status = res.statusCode >= 400 ? res.statusCode : 500;
  res.status(status).json({
    message: err.message ?? "Internal server error"
  });
};
