import { Router } from "express"; // 创建路由所需的 Router
import { articleController } from "./article.controller"; // 引入文章控制器
import { authenticate, requireRole } from "../../middleware/auth.middleware"; // 引入认证与权限中间件
import { uploadMiddleware } from "../../config/multer"; // 引入上传中间件处理封面
// ---------------------------- 分隔线 ----------------------------
const router = Router(); // 创建文章路由实例
// ---------------------------- 分隔线 ----------------------------
router.get("/", articleController.list); // 公共接口获取文章列表
router.get("/:id", articleController.detail); // 公共接口获取文章详情
router.post( // 创建文章接口
  "/", // 请求路径
  authenticate, // 需要先登录
  requireRole(["admin", "editor"]), // 仅管理员与编辑可操作
  uploadMiddleware.single("coverImage"), // 处理封面上传
  articleController.create // 委托控制器处理业务
); // 结束 router.post 定义
router.put( // 更新文章接口
  "/:id", // 路径包含文章 ID
  authenticate, // 需要登录
  requireRole(["admin", "editor"]), // 仅管理员与编辑可操作
  uploadMiddleware.single("coverImage"), // 支持更新封面
  articleController.update // 委托控制器执行更新
); // 结束 router.put 定义
router.delete( // 删除文章接口
  "/:id", // 指定文章 ID
  authenticate, // 需要登录
  requireRole(["admin"]), // 必须是管理员
  articleController.remove // 执行删除
); // 结束 router.delete 定义
// ---------------------------- 分隔线 ----------------------------
export const articleRoutes = router; // 导出文章路由供聚合使用
