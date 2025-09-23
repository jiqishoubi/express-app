import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { uploadMiddleware } from "../../config/multer";

const router = Router();

router.post(
  "/images",
  authenticate,
  uploadMiddleware.single("file"), // 期待 multipart 表单中包含名为 file 的文件字段
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    res.status(201).json({
      filename: req.file.filename,
      url: `/uploads/${req.file.filename}`
    });
  }
);

export const uploadRoutes = router;
