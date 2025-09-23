import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "../modules/users/user.entity";
import { Article } from "../modules/articles/article.entity";

dotenv.config();

// 从环境变量读取数据库配置，方便在不同环境部署
const host = process.env.DB_HOST ?? "localhost";
const port = Number(process.env.DB_PORT ?? 3306);
const username = process.env.DB_USERNAME ?? "root";
const password = process.env.DB_PASSWORD ?? "";
const database = process.env.DB_NAME ?? "express_admin";

export const AppDataSource = new DataSource({
  type: "mysql",
  host,
  port,
  username,
  password,
  database,
  entities: [User, Article], // 注册实体类，便于 TypeORM 生成表结构并执行查询
  synchronize: true, // 启动时自动同步表结构（演示方便，上线建议改用迁移）
  logging: false,
  charset: "utf8mb4_unicode_ci"
});

export const initializeDatabase = async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize(); // 延迟建立 MySQL 连接，应用启动时再初始化
  }
  return AppDataSource;
};
