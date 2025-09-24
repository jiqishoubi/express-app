import { Router } from "express"; // 引入 Router 用于创建聚合路由
import { authRoutes } from "../modules/auth/auth.routes"; // 引入认证模块路由
import { userRoutes } from "../modules/users/user.routes"; // 引入用户模块路由
import { articleRoutes } from "../modules/articles/article.routes"; // 引入文章模块路由
import { uploadRoutes } from "../modules/uploads/upload.routes"; // 引入上传模块路由
// ---------------------------- 分隔线 ----------------------------
export const apiRouter = Router(); // 创建并导出 API 总路由
// ---------------------------- 分隔线 ----------------------------
apiRouter.use("/auth", authRoutes); // 将认证路由挂载到 /api/auth
apiRouter.use("/users", userRoutes); // 将用户路由挂载到 /api/users
apiRouter.use("/articles", articleRoutes); // 将文章路由挂载到 /api/articles
apiRouter.use("/uploads", uploadRoutes); // 将上传路由挂载到 /api/uploads
