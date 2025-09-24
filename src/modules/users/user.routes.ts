import { Router } from "express"; // 引入 Router 构建子路由
import { userController } from "./user.controller"; // 引入用户控制器
import { authenticate, requireRole } from "../../middleware/auth.middleware"; // 引入认证与权限中间件
// ---------------------------- 分隔线 ----------------------------
const router = Router(); // 创建路由实例
// ---------------------------- 分隔线 ----------------------------
router.use(authenticate); // 在所有用户路由前先进行身份验证
// ---------------------------- 分隔线 ----------------------------
router.get("/", requireRole(["admin", "editor"]), userController.list); // 管理员和编辑可以获取用户列表
router.get("/:id", requireRole(["admin", "editor"]), userController.detail); // 管理员和编辑可以获取详情
router.post("/", requireRole(["admin"]), userController.create); // 只有管理员可以创建用户
router.put("/:id", requireRole(["admin"]), userController.update); // 只有管理员可以更新用户
router.delete("/:id", requireRole(["admin"]), userController.remove); // 只有管理员可以删除用户
// ---------------------------- 分隔线 ----------------------------
export const userRoutes = router; // 导出配置好的用户路由
