import { Request, Response } from "express"; // 引入请求与响应类型
import { // 引入文章服务的方法
  listArticles, // 列出文章
  getArticleById, // 根据 ID 获取文章
  createArticle, // 创建文章
  updateArticle, // 更新文章
  deleteArticle // 删除文章
} from "./article.service";
// ---------------------------- 分隔线 ----------------------------
export const articleController = { // 导出文章控制器
  async list(_req: Request, res: Response) { // 处理获取文章列表
    const articles = await listArticles(); // 调用服务查询数据
    res.json(articles); // 返回文章数组
  }, // 结束 list 方法
  async detail(req: Request, res: Response) { // 处理文章详情请求
    const id = Number(req.params.id); // 获取路径参数
    const article = await getArticleById(id); // 查询文章
    if (!article) { // 未找到时
      return res.status(404).json({ message: "Article not found" }); // 返回 404
    } // 结束存在性判断
    res.json(article); // 返回文章详情
  }, // 结束 detail 方法
  async create(req: Request, res: Response) { // 处理创建请求
    if (!req.user) { // 没有登录信息
      return res.status(401).json({ message: "Unauthorized" }); // 返回 401
    } // 结束登录判断
    const article = await createArticle(req.user.id, { // 调用服务创建文章
      title: req.body.title, // 标题
      content: req.body.content, // 内容
      coverImage: req.file ? `/uploads/${req.file.filename}` : req.body.coverImage, // 若上传封面则使用新路径
      published: req.body.published // 发布状态
    }); // 结束 createArticle 调用
    res.status(201).json(article); // 返回创建结果
  }, // 结束 create 方法
  async update(req: Request, res: Response) { // 处理更新请求
    const id = Number(req.params.id); // 获取目标 ID
    const article = await updateArticle(id, { // 更新文章
      title: req.body.title, // 更新标题
      content: req.body.content, // 更新内容
      coverImage: req.file ? `/uploads/${req.file.filename}` : req.body.coverImage, // 更新封面
      published: req.body.published // 更新状态
    }); // 结束 updateArticle 调用
    res.json(article); // 返回更新结果
  }, // 结束 update 方法
  async remove(req: Request, res: Response) { // 处理删除请求
    const id = Number(req.params.id); // 获取文章 ID
    await deleteArticle(id); // 执行删除
    res.status(204).send(); // 返回 204 无内容
  } // 结束 remove 方法
}; // 结束 articleController 定义
