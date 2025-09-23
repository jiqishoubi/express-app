import { Router } from "express";
import { userController } from "./user.controller";
import { authenticate, requireRole } from "../../middleware/auth.middleware";

const router = Router();

router.use(authenticate); // 所有用户相关的接口都必须先通过身份校验

router.get("/", requireRole(["admin", "editor"]), userController.list);
router.get("/:id", requireRole(["admin", "editor"]), userController.detail);
router.post("/", requireRole(["admin"]), userController.create);
router.put("/:id", requireRole(["admin"]), userController.update);
router.delete("/:id", requireRole(["admin"]), userController.remove);

export const userRoutes = router;
