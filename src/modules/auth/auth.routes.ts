import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.post("/register", authController.register); // 公共接口，允许新用户注册
router.post("/login", authController.login); // 登录接口，用账号密码换取 JWT

export const authRoutes = router;
