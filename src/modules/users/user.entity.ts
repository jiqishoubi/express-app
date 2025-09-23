import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from "typeorm";
import { Article } from "../articles/article.entity";

export type Role = "admin" | "editor" | "user";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string; // 邮箱需要保持唯一，方便登录时定位用户

  @Column()
  name!: string;

  @Column()
  password!: string; // 保存的是 bcrypt 加密后的密码

  @Column({ type: "text", default: "user" })
  role!: Role; // 角色决定用户可以访问哪些接口

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Article, (article) => article.author)
  articles!: Article[];
}
