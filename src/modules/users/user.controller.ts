import { Request, Response } from "express";
import {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from "./user.service";

export const userController = {
  async list(_req: Request, res: Response) {
    const users = await listUsers();
    res.json(users);
  },

  async detail(req: Request, res: Response) {
    const id = Number(req.params.id);
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  },

  async create(req: Request, res: Response) {
    // 表单数据由前端提交，服务层会负责校验和加密等处理
    const user = await createUser({
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
      role: req.body.role
    });
    res.status(201).json(user);
  },

  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const user = await updateUser(id, req.body);
    res.json(user);
  },

  async remove(req: Request, res: Response) {
    const id = Number(req.params.id);
    await deleteUser(id);
    res.status(204).send();
  }
};
