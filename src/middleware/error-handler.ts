import { Request, Response, NextFunction } from "express"; // 引入 Express 类型用于声明中间件签名
// ---------------------------- 分隔线 ----------------------------
export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => { // 导出统一错误处理中间件
  console.error(err); // 打印错误信息方便调试
  const status = res.statusCode >= 400 ? res.statusCode : 500; // 如果之前已经设置状态码则沿用，否则默认 500
  res.status(status).json({ // 返回统一格式的 JSON 响应
    message: err.message ?? "Internal server error" // 将错误消息带回给前端，避免泄露堆栈信息
  }); // 结束 res.status 调用
}; // 结束 errorHandler 定义
