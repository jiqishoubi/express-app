import "reflect-metadata"; // 引入 reflect-metadata 以支持 TypeORM 装饰器
import dotenv from "dotenv"; // 引入 dotenv 读取环境变量
import { initializeDatabase } from "./config/data-source"; // 引入数据库初始化函数
import { buildApp } from "./app"; // 引入构建 Express 应用的函数
// ---------------------------- 分隔线 ----------------------------
dotenv.config(); // 加载 .env 文件中的配置
// ---------------------------- 分隔线 ----------------------------
const port = Number(process.env.PORT ?? 3000); // 读取服务端口，默认 3000
// ---------------------------- 分隔线 ----------------------------
(async () => { // 立即执行异步函数便于使用 await
  try { // 尝试执行启动流程
    await initializeDatabase(); // 等待数据库连接准备就绪
    const app = buildApp(); // 构建 Express 应用实例
    app.listen(port, () => { // 监听指定端口
      console.log(`Server running on http://localhost:${port}`); // 控制台打印启动成功信息
    }); // 结束监听回调
  } catch (error) { // 捕获启动过程中的异常
    console.error("Failed to start server", error); // 输出错误详情
    process.exit(1); // 以非零状态码退出表示失败
  }
})(); // 立即调用封装的异步函数
