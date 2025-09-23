import { Request, Response } from "express";
import {
  listArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle
} from "./article.service";

export const articleController = {
  async list(_req: Request, res: Response) {
    const articles = await listArticles();
    res.json(articles);
  },

  async detail(req: Request, res: Response) {
    const id = Number(req.params.id);
    const article = await getArticleById(id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.json(article);
  },

  async create(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const article = await createArticle(req.user.id, {
      title: req.body.title,
      content: req.body.content,
      coverImage: req.file ? `/uploads/${req.file.filename}` : req.body.coverImage, // 如果有上传文件则使用新的封面地址
      published: req.body.published
    });
    res.status(201).json(article);
  },

  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const article = await updateArticle(id, {
      title: req.body.title,
      content: req.body.content,
      coverImage: req.file ? `/uploads/${req.file.filename}` : req.body.coverImage,
      published: req.body.published
    });
    res.json(article);
  },

  async remove(req: Request, res: Response) {
    const id = Number(req.params.id);
    await deleteArticle(id);
    res.status(204).send();
  }
};
