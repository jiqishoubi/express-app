import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
import { User } from "../users/user.entity";

@Entity("articles")
export class Article {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ type: "text" })
  content!: string; // 保存文章正文，可使用 Markdown 或 HTML

  @Column({ nullable: true })
  coverImage?: string; // 存储上传封面的相对 URL

  @Column({ default: false })
  published!: boolean; // 标识文章是否对外发布

  @ManyToOne(() => User, (user) => user.articles, { eager: true })
  author!: User; // 读取文章时主动加载作者信息，方便直接使用

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
