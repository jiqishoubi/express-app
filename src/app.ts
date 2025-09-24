import express from "express"; // 引入 express 框架以创建 HTTP 服务
import cors from "cors"; // 引入 cors 中间件处理跨域请求
import helmet from "helmet"; // 引入 helmet 提升基础安全性
import morgan from "morgan"; // 引入 morgan 在控制台输出访问日志
import path from "path"; // 引入 path 用于路径拼接
import "express-async-errors"; // 引入 express-async-errors 让异步路由抛出的错误被捕获
import dotenv from "dotenv"; // 引入 dotenv 读取环境变量
import { apiRouter } from "./routes"; // 引入聚合后的 API 路由
import { errorHandler } from "./middleware/error-handler"; // 引入统一错误处理中间件
import { uploadPath } from "./config/multer"; // 引入上传目录配置
// ---------------------------- 分隔线 ----------------------------
dotenv.config(); // 加载 .env 配置
// ---------------------------- 分隔线 ----------------------------
export function buildApp() { // 导出一个函数创建并返回 app 实例
  const app = express(); // 初始化 express 应用
  app.use(cors()); // 注册 cors 中间件以允许跨域请求
  app.use(helmet()); // 注册 helmet 设置安全响应头
  app.use(morgan("dev")); // 注册 morgan 在开发模式输出详细日志
  app.use(express.json()); // 注册内置中间件解析 JSON 请求体
  app.use(express.urlencoded({ extended: true })); // 注册解析 URL 编码的表单数据
  app.use("/uploads", express.static(uploadPath)); // 将上传目录作为静态资源对外暴露
  app.use("/api", apiRouter); // 将业务路由挂载到 /api 前缀下
  app.use(errorHandler); // 在所有路由之后注册统一错误处理
  app.get("/health", (_req, res) => { // 定义健康检查接口
    res.json({ status: "ok" }); // 返回服务状态表示运行正常
  }); // 结束健康检查路由回调
  return app; // 返回构建完成的 app 实例
} // 结束 buildApp 函数定义
