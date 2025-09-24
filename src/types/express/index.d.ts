import type { Role } from "../../modules/users/user.entity"; // 引入角色类型以绑定到请求对象
// ---------------------------- 分隔线 ----------------------------
declare global { // 声明全局命名空间扩展 Express 类型
  namespace Express { // 指定扩展 Express 命名空间
    interface Request { // 扩展 Request 接口
      user?: { // 自定义 user 属性用于保存认证信息
        id: number; // 用户 ID
        email: string; // 用户邮箱
        role: Role; // 用户角色
      }; // 结束 user 属性声明
    } // 结束 Request 接口声明
  } // 结束 Express 命名空间扩展
} // 结束全局声明
// ---------------------------- 分隔线 ----------------------------
export {}; // 导出空对象确保该文件被视为模块
