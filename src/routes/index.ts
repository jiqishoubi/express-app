import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { userRoutes } from "../modules/users/user.routes";
import { articleRoutes } from "../modules/articles/article.routes";
import { uploadRoutes } from "../modules/uploads/upload.routes";

export const apiRouter = Router();

apiRouter.use("/auth", authRoutes); // 鉴权相关接口统一挂载在 /api/auth
apiRouter.use("/users", userRoutes);
apiRouter.use("/articles", articleRoutes);
apiRouter.use("/uploads", uploadRoutes);
