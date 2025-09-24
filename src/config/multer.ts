import multer from "multer"; // 引入 multer 处理文件上传
import path from "path"; // 引入 path 用于拼接路径
import fs from "fs"; // 引入 fs 操作文件系统
import dotenv from "dotenv"; // 引入 dotenv 读取环境变量
// ---------------------------- 分隔线 ----------------------------
dotenv.config(); // 加载环境变量
// ---------------------------- 分隔线 ----------------------------
export const uploadPath = process.env.UPLOAD_DIR // 导出上传文件存储路径
  ? path.resolve(process.cwd(), process.env.UPLOAD_DIR) // 如果设置了自定义目录则解析该路径
  : path.resolve(process.cwd(), "uploads"); // 否则默认放在项目根目录的 uploads 下
// ---------------------------- 分隔线 ----------------------------
if (!fs.existsSync(uploadPath)) { // 如果目标目录不存在
  fs.mkdirSync(uploadPath, { recursive: true }); // 自动递归创建目录
} // 结束目录存在性判断
// ---------------------------- 分隔线 ----------------------------
const storage = multer.diskStorage({ // 配置 multer 使用磁盘存储
  destination: (_req, _file, cb) => { // 指定文件保存目录
    cb(null, uploadPath); // 使用上面计算出的上传路径
  }, // 结束 destination 回调
  filename: (_req, file, cb) => { // 指定保存的文件名
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`; // 使用时间戳和随机数加扩展名
    cb(null, uniqueName); // 将生成的文件名交给回调
  } // 结束 filename 回调
}); // 结束 diskStorage 配置
// ---------------------------- 分隔线 ----------------------------
const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => { // 定义文件过滤逻辑
  if (!file.mimetype.startsWith("image/")) { // 如果上传的不是图片类型
    return cb(new Error("Only image uploads are allowed")); // 返回错误仅允许图片
  } // 结束类型判断
  cb(null, true); // 校验通过继续上传
}; // 结束 fileFilter 定义
// ---------------------------- 分隔线 ----------------------------
export const uploadMiddleware = multer({ // 创建并导出 multer 中间件
  storage, // 使用上面定义的存储策略
  fileFilter, // 使用上面定义的文件过滤
  limits: { fileSize: 5 * 1024 * 1024 } // 限制最大 5MB
}); // 结束 multer 配置
