import { AppDataSource } from "../../config/data-source"; // 引入数据源以获取仓库
import { Article } from "./article.entity"; // 引入文章实体
import { User } from "../users/user.entity"; // 引入用户实体用于验证作者
// ---------------------------- 分隔线 ----------------------------
const articleRepository = () => AppDataSource.getRepository(Article); // 获取文章仓库
const userRepository = () => AppDataSource.getRepository(User); // 获取用户仓库
// ---------------------------- 分隔线 ----------------------------
export type ArticleInput = { // 定义文章输入类型
  title: string; // 文章标题
  content: string; // 文章内容
  coverImage?: string | null; // 可选封面图片地址
  published?: boolean; // 可选发布状态
}; // 结束 ArticleInput 类型
// ---------------------------- 分隔线 ----------------------------
export const listArticles = () => articleRepository().find(); // 查询所有文章
// ---------------------------- 分隔线 ----------------------------
export const getArticleById = (id: number) => // 根据 ID 查询文章
  articleRepository().findOne({ where: { id } }); // 返回查询结果
// ---------------------------- 分隔线 ----------------------------
export const createArticle = async (authorId: number, input: ArticleInput) => { // 创建文章
  const author = await userRepository().findOne({ where: { id: authorId } }); // 查找作者
  if (!author) { // 如果未找到作者
    throw new Error("Author not found"); // 抛出异常
  } // 结束作者存在性判断
  const article = articleRepository().create({ // 创建文章实体
    ...input, // 解构输入字段
    coverImage: input.coverImage ?? null, // 如果未提供封面则保存为 null
    published: input.published ?? false, // 默认未发布
    author // 关联作者
  }); // 结束 create 调用
  return articleRepository().save(article); // 保存文章并返回结果
}; // 结束 createArticle 定义
// ---------------------------- 分隔线 ----------------------------
export const updateArticle = async (id: number, input: ArticleInput) => { // 更新文章
  const repo = articleRepository(); // 获取文章仓库
  const article = await repo.findOne({ where: { id } }); // 查询目标文章
  if (!article) { // 若未找到
    throw new Error("Article not found"); // 抛出异常
  } // 结束存在性判断
  article.title = input.title ?? article.title; // 更新标题
  article.content = input.content ?? article.content; // 更新内容
  article.coverImage = input.coverImage ?? article.coverImage ?? null; // 更新封面
  article.published = input.published ?? article.published; // 更新发布状态
  return repo.save(article); // 保存并返回最新数据
}; // 结束 updateArticle 定义
// ---------------------------- 分隔线 ----------------------------
export const deleteArticle = async (id: number) => { // 删除文章
  const repo = articleRepository(); // 获取文章仓库
  const article = await repo.findOne({ where: { id } }); // 查询文章
  if (!article) { // 如果不存在
    throw new Error("Article not found"); // 抛出异常
  } // 结束存在性判断
  await repo.remove(article); // 执行删除操作
}; // 结束 deleteArticle 定义
