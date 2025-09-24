import { Router } from "express"; // 引入 Router 构建路由
import { authenticate } from "../../middleware/auth.middleware"; // 引入认证中间件
import { uploadMiddleware } from "../../config/multer"; // 引入上传中间件
// ---------------------------- 分隔线 ----------------------------
const router = Router(); // 创建上传路由实例
// ---------------------------- 分隔线 ----------------------------
router.post( // 定义图片上传接口
  "/images", // 路径为 /images
  authenticate, // 需要先登录
  uploadMiddleware.single("file"), // 使用 multer 处理单文件字段名为 file
  (req, res) => { // 业务处理函数
    if (!req.file) { // 如果请求中没有文件
      return res.status(400).json({ message: "No file uploaded" }); // 返回 400 提示
    } // 结束文件存在性判断
    res.status(201).json({ // 上传成功返回文件信息
      filename: req.file.filename, // 保存的文件名
      url: `/uploads/${req.file.filename}` // 可供访问的相对路径
    }); // 结束 res.status 调用
  } // 结束上传回调
); // 结束 router.post 定义
// ---------------------------- 分隔线 ----------------------------
export const uploadRoutes = router; // 导出上传路由
