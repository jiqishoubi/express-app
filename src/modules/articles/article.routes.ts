import { Router } from "express";
import { articleController } from "./article.controller";
import { authenticate, requireRole } from "../../middleware/auth.middleware";
import { uploadMiddleware } from "../../config/multer";

const router = Router();

router.get("/", articleController.list);
router.get("/:id", articleController.detail);

router.post(
  "/",
  authenticate,
  requireRole(["admin", "editor"]),
  uploadMiddleware.single("coverImage"), // 期待 multipart 表单里有名为 coverImage 的文件字段
  articleController.create
);

router.put(
  "/:id",
  authenticate,
  requireRole(["admin", "editor"]),
  uploadMiddleware.single("coverImage"),
  articleController.update
);

router.delete(
  "/:id",
  authenticate,
  requireRole(["admin"]),
  articleController.remove
);

export const articleRoutes = router;
