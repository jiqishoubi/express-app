import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import "express-async-errors"; // 让异步路由抛出的异常自动被捕获
import dotenv from "dotenv";
import { apiRouter } from "./routes";
import { errorHandler } from "./middleware/error-handler";
import { uploadPath } from "./config/multer";

dotenv.config();

export function buildApp() {
  const app = express();

  app.use(cors()); // 允许前端跨域访问 API
  app.use(helmet()); // 设置常用的安全响应头
  app.use(morgan("dev")); // 在开发环境打印每次请求的日志
  app.use(express.json()); // 解析 JSON 请求体
  app.use(express.urlencoded({ extended: true })); // 解析表单提交的数据

  app.use("/uploads", express.static(uploadPath)); // 将上传目录暴露为静态资源
  app.use("/api", apiRouter); // 将业务接口统一挂载在 /api 路径
  app.use(errorHandler); // 统一异常处理，保持返回格式一致

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  return app;
}
