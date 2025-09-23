import "reflect-metadata"; // 让 TypeORM 的装饰器在运行时生成元数据
import dotenv from "dotenv";
import { initializeDatabase } from "./config/data-source";
import { buildApp } from "./app";

dotenv.config(); // 在使用配置前加载环境变量

const port = Number(process.env.PORT ?? 3000); // 如果没有提供 PORT 参数则使用 3000 端口

(async () => {
  try {
    await initializeDatabase(); // 在处理请求前确保数据库已连接
    const app = buildApp(); // 构建带有中间件和路由的 Express 应用
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
})();
