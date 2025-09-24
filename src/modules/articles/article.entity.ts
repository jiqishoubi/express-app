import { // 引入 TypeORM 装饰器声明实体结构
  Entity, // Entity 声明数据库表
  PrimaryGeneratedColumn, // PrimaryGeneratedColumn 声明自增主键
  Column, // Column 声明普通列
  ManyToOne, // ManyToOne 声明多对一关系
  CreateDateColumn, // CreateDateColumn 自动记录创建时间
  UpdateDateColumn // UpdateDateColumn 自动记录更新时间
} from "typeorm";
import { User } from "../users/user.entity"; // 引入用户实体以建立关联
// ---------------------------- 分隔线 ----------------------------
@Entity("articles") // 将该实体映射到 articles 表
export class Article { // 定义 Article 实体类
  @PrimaryGeneratedColumn() // 声明 id 为主键
  id!: number; // 文章唯一标识
  @Column() // 声明标题列
  title!: string; // 文章标题
  @Column({ type: "text" }) // 声明正文列使用 text 类型
  content!: string; // 文章内容支持较长文本
  @Column({ nullable: true }) // 声明封面地址列允许为空
  coverImage?: string; // 文章封面图片路径
  @Column({ default: false }) // 声明发布状态列默认未发布
  published!: boolean; // 文章是否发布
  @ManyToOne(() => User, (user) => user.articles, { eager: true }) // 多对一关联作者并启用自动加载
  author!: User; // 文章作者信息
  @CreateDateColumn() // 自动写入创建时间
  createdAt!: Date; // 文章创建时间
  @UpdateDateColumn() // 自动写入更新时间
  updatedAt!: Date; // 文章最近更新时间
} // 结束 Article 实体定义
