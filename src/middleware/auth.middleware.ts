import { Request, Response, NextFunction } from "express"; // 引入 Express 类型定义
import jwt from "jsonwebtoken"; // 引入 jsonwebtoken 处理 JWT
import dotenv from "dotenv"; // 引入 dotenv 读取环境变量
import { Role } from "../modules/users/user.entity"; // 引入角色类型方便做权限判断
// ---------------------------- 分隔线 ----------------------------
dotenv.config(); // 加载环境变量
// ---------------------------- 分隔线 ----------------------------
const secret = process.env.JWT_SECRET; // 从环境变量获取 JWT 秘钥
// ---------------------------- 分隔线 ----------------------------
if (!secret) { // 如果没有配置秘钥
  throw new Error("JWT_SECRET is not configured"); // 直接抛错提示配置
} // 结束秘钥校验
// ---------------------------- 分隔线 ----------------------------
type TokenPayload = { // 定义解码后令牌的类型结构
  id: number; // 用户 ID
  email: string; // 用户邮箱
  role: Role; // 用户角色
}; // 结束类型定义
// ---------------------------- 分隔线 ----------------------------
export const authenticate = (req: Request, res: Response, next: NextFunction) => { // 导出认证中间件
  const header = req.headers.authorization; // 读取请求头中的 Authorization 字段
  if (!header || !header.startsWith("Bearer ")) { // 如果没有携带或格式不正确
    return res.status(401).json({ message: "Missing authorization header" }); // 返回 401 提示缺少认证信息
  } // 结束请求头校验
  const token = header.slice(7); // 去掉 "Bearer " 前缀获取真正的 token
  try { // 尝试验证 token
    const payload = jwt.verify(token, secret) as TokenPayload; // 校验 token 并转换成我们定义的类型
    req.user = payload; // 将解析出的用户信息放到 req 上
    next(); // 继续执行后续中间件或路由
  } catch (error) { // 验证失败时捕获异常
    return res.status(401).json({ message: "Invalid or expired token" }); // 返回 401 表示 token 无效或过期
  } // 结束 try-catch
}; // 结束 authenticate 定义
// ---------------------------- 分隔线 ----------------------------
export const requireRole = (roles: Role[]) => { // 导出角色校验高阶函数
  return (req: Request, res: Response, next: NextFunction) => { // 返回实际的中间件逻辑
    if (!req.user) { // 如果之前没有通过认证
      return res.status(401).json({ message: "Unauthorized" }); // 返回 401 表示需要登录
    } // 结束是否登录判断
    if (!roles.includes(req.user.role)) { // 判断当前用户角色是否在允许列表
      return res.status(403).json({ message: "Forbidden" }); // 返回 403 表示权限不足
    } // 结束角色检查
    next(); // 权限校验通过继续后续流程
  }; // 结束内部中间件定义
}; // 结束 requireRole 定义
