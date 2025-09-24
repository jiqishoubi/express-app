import { DataSource } from "typeorm"; // 引入 TypeORM 的 DataSource 用于建立数据库连接
import dotenv from "dotenv"; // 引入 dotenv 读取环境变量
import { User } from "../modules/users/user.entity"; // 引入用户实体注册到 TypeORM
import { Article } from "../modules/articles/article.entity"; // 引入文章实体注册到 TypeORM
// ---------------------------- 分隔线 ----------------------------
dotenv.config(); // 加载环境变量配置
// ---------------------------- 分隔线 ----------------------------
const host = process.env.DB_HOST ?? "localhost"; // 读取数据库主机地址，默认为本机
const port = Number(process.env.DB_PORT ?? 3306); // 读取数据库端口，默认 3306
const username = process.env.DB_USERNAME ?? "root"; // 读取数据库用户名，默认 root
const password = process.env.DB_PASSWORD ?? ""; // 读取数据库密码，默认空字符串
const database = process.env.DB_NAME ?? "express_admin"; // 读取数据库名称，默认 express_admin
// ---------------------------- 分隔线 ----------------------------
export const AppDataSource = new DataSource({ // 创建并导出全局 DataSource 实例
  type: "mysql", // 指定数据库类型为 MySQL
  host, // 使用上面的主机配置
  port, // 使用上面的端口配置
  username, // 使用上面的用户名配置
  password, // 使用上面的密码配置
  database, // 使用上面的数据库名称
  entities: [User, Article], // 注册实体列表
  synchronize: true, // 启用自动同步表结构（仅开发环境使用）
  logging: false, // 关闭 SQL 日志输出
  charset: "utf8mb4_unicode_ci" // 指定字符集以支持 Emoji
}); // 结束 DataSource 配置对象
// ---------------------------- 分隔线 ----------------------------
export const initializeDatabase = async () => { // 导出初始化数据库的异步方法
  if (!AppDataSource.isInitialized) { // 判断 DataSource 是否已初始化
    await AppDataSource.initialize(); // 如果未初始化则建立连接
  } // 结束 if 判断
  return AppDataSource; // 返回 DataSource 实例
}; // 结束 initializeDatabase 函数
