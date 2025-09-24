import { Request, Response } from "express"; // 引入请求与响应类型
import { // 引入用户服务中的方法
  listUsers, // 列出所有用户
  getUserById, // 根据 ID 获取用户
  createUser, // 创建用户
  updateUser, // 更新用户
  deleteUser // 删除用户
} from "./user.service";
// ---------------------------- 分隔线 ----------------------------
export const userController = { // 导出用户控制器对象
  async list(_req: Request, res: Response) { // 处理获取用户列表的请求
    const users = await listUsers(); // 调用服务层获取数据
    res.json(users); // 返回 JSON 响应
  }, // 结束 list 方法
  async detail(req: Request, res: Response) { // 处理获取用户详情的请求
    const id = Number(req.params.id); // 从路径参数解析用户 ID
    const user = await getUserById(id); // 查询对应用户
    if (!user) { // 如果用户不存在
      return res.status(404).json({ message: "User not found" }); // 返回 404 提示
    } // 结束存在性判断
    res.json(user); // 返回用户信息
  }, // 结束 detail 方法
  async create(req: Request, res: Response) { // 处理创建用户的请求
    const user = await createUser({ // 调用服务层创建用户
      email: req.body.email, // 读取请求体中的邮箱
      name: req.body.name, // 读取请求体中的姓名
      password: req.body.password, // 读取请求体中的密码
      role: req.body.role // 读取请求体中的角色
    }); // 结束 createUser 调用
    res.status(201).json(user); // 返回 201 状态以及创建结果
  }, // 结束 create 方法
  async update(req: Request, res: Response) { // 处理更新用户的请求
    const id = Number(req.params.id); // 解析路径参数
    const user = await updateUser(id, req.body); // 调用服务层更新数据
    res.json(user); // 返回更新后的用户
  }, // 结束 update 方法
  async remove(req: Request, res: Response) { // 处理删除用户的请求
    const id = Number(req.params.id); // 获取要删除的 ID
    await deleteUser(id); // 调用服务层执行删除
    res.status(204).send(); // 返回 204 表示删除成功且无内容
  } // 结束 remove 方法
}; // 结束 userController 定义
