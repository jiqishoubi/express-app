import { AppDataSource } from "../../config/data-source";
import { Article } from "./article.entity";
import { User } from "../users/user.entity";

const articleRepository = () => AppDataSource.getRepository(Article);
const userRepository = () => AppDataSource.getRepository(User);

export type ArticleInput = {
  title: string;
  content: string;
  coverImage?: string | null;
  published?: boolean;
};

export const listArticles = () => articleRepository().find();

export const getArticleById = (id: number) =>
  articleRepository().findOne({ where: { id } });

export const createArticle = async (authorId: number, input: ArticleInput) => {
  const author = await userRepository().findOne({ where: { id: authorId } });
  if (!author) {
    throw new Error("Author not found");
  }

  const article = articleRepository().create({
    ...input,
    coverImage: input.coverImage ?? null,
    published: input.published ?? false,
    author
  });

  return articleRepository().save(article);
};

export const updateArticle = async (id: number, input: ArticleInput) => {
  const repo = articleRepository();
  const article = await repo.findOne({ where: { id } });
  if (!article) {
    throw new Error("Article not found");
  }

  article.title = input.title ?? article.title;
  article.content = input.content ?? article.content;
  article.coverImage = input.coverImage ?? article.coverImage ?? null; // 如果没有传新封面则沿用旧的地址
  article.published = input.published ?? article.published;

  return repo.save(article);
};

export const deleteArticle = async (id: number) => {
  const repo = articleRepository();
  const article = await repo.findOne({ where: { id } });
  if (!article) {
    throw new Error("Article not found");
  }
  await repo.remove(article);
};
