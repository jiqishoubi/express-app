import { Router } from "express"; // 引入 Router 构建路由
import { authController } from "./auth.controller"; // 引入认证控制器
// ---------------------------- 分隔线 ----------------------------
const router = Router(); // 创建路由实例
// ---------------------------- 分隔线 ----------------------------
router.post("/register", authController.register); // 注册接口，无需登录
router.post("/login", authController.login); // 登录接口，无需登录
// ---------------------------- 分隔线 ----------------------------
export const authRoutes = router; // 导出认证路由
