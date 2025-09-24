import { Request, Response } from "express"; // 引入请求与响应类型
import jwt from "jsonwebtoken"; // 引入 JWT 库用于签发令牌
import dotenv from "dotenv"; // 引入 dotenv 加载环境变量
import { registerUser, validateUserCredentials } from "../users/user.service"; // 引入用户注册和验证逻辑
import { Role } from "../users/user.entity"; // 引入角色类型
// ---------------------------- 分隔线 ----------------------------
dotenv.config(); // 加载环境变量
// ---------------------------- 分隔线 ----------------------------
const secret = process.env.JWT_SECRET; // 获取 JWT 秘钥
// ---------------------------- 分隔线 ----------------------------
if (!secret) { // 验证秘钥是否存在
  throw new Error("JWT_SECRET is not configured"); // 没有配置时直接抛出错误
} // 结束秘钥判断
// ---------------------------- 分隔线 ----------------------------
const createToken = (payload: { id: number; email: string; role: Role }) => // 声明生成令牌的辅助函数
  jwt.sign(payload, secret, { expiresIn: "12h" }); // 使用秘钥签发有效期 12 小时的令牌
// ---------------------------- 分隔线 ----------------------------
export const authController = { // 导出认证控制器
  async register(req: Request, res: Response) { // 处理注册请求
    const user = await registerUser({ // 调用服务层创建用户
      email: req.body.email, // 邮箱
      name: req.body.name, // 姓名
      password: req.body.password, // 密码
      role: req.body.role // 角色
    }); // 结束 registerUser 调用
    const token = createToken({ id: user.id, email: user.email, role: user.role }); // 生成登录令牌
    res.status(201).json({ user, token }); // 返回新用户与令牌
  }, // 结束 register 方法
  async login(req: Request, res: Response) { // 处理登录请求
    const { email, password } = req.body; // 从请求体获取账号密码
    const user = await validateUserCredentials(email, password); // 校验账号密码
    if (!user) { // 如果校验失败
      return res.status(401).json({ message: "Invalid email or password" }); // 返回 401 提示
    } // 结束校验判断
    const token = createToken({ id: user.id, email: user.email, role: user.role }); // 校验成功生成令牌
    res.json({ // 返回用户信息与令牌
      user: { // 仅提供必要字段
        id: user.id, // ID
        email: user.email, // 邮箱
        name: user.name, // 姓名
        role: user.role, // 角色
        createdAt: user.createdAt, // 创建时间
        updatedAt: user.updatedAt // 更新时间
      }, // 结束 user 数据
      token // JWT 令牌
    }); // 结束 res.json 调用
  } // 结束 login 方法
}; // 结束 authController 定义
