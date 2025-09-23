import type { Role } from "../../modules/users/user.entity";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: Role;
      };
    }
  }
}

export {}; // 导出空对象让文件成为模块，确保声明被正确合并
