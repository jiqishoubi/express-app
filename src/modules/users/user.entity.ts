import { // 按需引入 TypeORM 的装饰器
  Entity, // Entity 装饰器用于声明类对应数据库表
  PrimaryGeneratedColumn, // PrimaryGeneratedColumn 声明自增主键
  Column, // Column 声明普通列
  CreateDateColumn, // CreateDateColumn 自动记录创建时间
  UpdateDateColumn, // UpdateDateColumn 自动记录更新时间
  OneToMany // OneToMany 声明一对多关系
} from "typeorm";
import { Article } from "../articles/article.entity"; // 引入文章实体用于建立关联
// ---------------------------- 分隔线 ----------------------------
export type Role = "admin" | "editor" | "user"; // 定义角色枚举类型
// ---------------------------- 分隔线 ----------------------------
@Entity("users") // 声明该实体对应数据库中的 users 表
export class User { // 定义 User 实体类
  @PrimaryGeneratedColumn() // 声明 id 为自增主键
  id!: number; // 用户唯一标识
  @Column({ unique: true }) // 声明 email 列并设置唯一约束
  email!: string; // 用户邮箱
  @Column() // 声明 name 列
  name!: string; // 用户姓名
  @Column() // 声明 password 列
  password!: string; // 哈希后的密码
  @Column({ type: "text", default: "user" }) // 声明角色列默认值为 user
  role!: Role; // 用户角色
  @CreateDateColumn() // 自动填充创建时间
  createdAt!: Date; // 记录创建时间
  @UpdateDateColumn() // 自动填充更新时间
  updatedAt!: Date; // 记录最近更新时间
  @OneToMany(() => Article, (article) => article.author) // 声明与文章的一对多关系
  articles!: Article[]; // 用户拥有的文章列表
} // 结束 User 实体定义
