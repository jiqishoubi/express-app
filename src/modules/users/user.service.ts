import { AppDataSource } from "../../config/data-source"; // 引入全局数据源用于获取仓库
import { User, Role } from "./user.entity"; // 引入用户实体和角色类型
import { hashPassword, verifyPassword } from "../../utils/password"; // 引入密码哈希与校验工具
// ---------------------------- 分隔线 ----------------------------
const userRepository = () => AppDataSource.getRepository(User); // 封装获取用户仓库的函数
// ---------------------------- 分隔线 ----------------------------
export type CreateUserInput = { // 定义创建用户时需要的字段
  email: string; // 邮箱地址
  name: string; // 显示名称
  password: string; // 明文密码（会在服务内加密）
  role?: Role; // 可选的角色字段
}; // 结束 CreateUserInput 类型
// ---------------------------- 分隔线 ----------------------------
export type UpdateUserInput = Partial<Omit<CreateUserInput, "password">> & { // 定义更新用户时允许的字段
  password?: string; // 密码单独设为可选
}; // 结束 UpdateUserInput 类型
// ---------------------------- 分隔线 ----------------------------
export const listUsers = async () => { // 导出获取全部用户列表的方法
  const users = await userRepository().find(); // 从数据库中查找所有用户
  return users.map(toSafeUser); // 将用户转换为安全对象去除敏感信息
}; // 结束 listUsers 定义
// ---------------------------- 分隔线 ----------------------------
export const getUserById = async (id: number) => { // 导出根据 ID 获取用户的方法
  const user = await userRepository().findOne({ where: { id } }); // 按 ID 查询单个用户
  return user ? toSafeUser(user) : null; // 找到则返回安全对象，否则返回 null
}; // 结束 getUserById 定义
// ---------------------------- 分隔线 ----------------------------
export const findRawUserByEmail = (email: string) => // 导出根据邮箱查找原始用户的方法
  userRepository().findOne({ where: { email } }); // 直接返回查找 Promise（包含敏感字段）
// ---------------------------- 分隔线 ----------------------------
export const registerUser = async (input: CreateUserInput) => { // 导出注册新用户的方法
  const existing = await findRawUserByEmail(input.email); // 先判断邮箱是否已存在
  if (existing) { // 如果邮箱已存在
    throw new Error("Email already registered"); // 抛出错误阻止重复注册
  } // 结束邮箱重复判断
  const hashed = await hashPassword(input.password); // 对明文密码进行哈希处理
  const user = userRepository().create({ // 创建用户实体实例
    email: input.email, // 设置邮箱
    name: input.name, // 设置名称
    password: hashed, // 保存哈希后的密码
    role: input.role ?? "user" // 如未指定角色则默认 user
  }); // 结束 create 调用
  await userRepository().save(user); // 将用户保存到数据库
  return toSafeUser(user); // 返回安全对象
}; // 结束 registerUser 定义
// ---------------------------- 分隔线 ----------------------------
export const createUser = registerUser; // 管理端创建用户沿用注册流程
// ---------------------------- 分隔线 ----------------------------
export const updateUser = async (id: number, input: UpdateUserInput) => { // 导出更新用户信息的方法
  const repo = userRepository(); // 获取仓库实例
  const user = await repo.findOne({ where: { id } }); // 查询目标用户
  if (!user) { // 如果未找到
    throw new Error("User not found"); // 抛出异常提示不存在
  } // 结束用户存在性判断
  if (input.email) user.email = input.email; // 若传入邮箱则更新
  if (input.name) user.name = input.name; // 若传入名称则更新
  if (input.role) user.role = input.role; // 若传入角色则更新
  if (input.password) { // 若传入新密码
    user.password = await hashPassword(input.password); // 哈希后再保存
  } // 结束密码处理
  await repo.save(user); // 持久化更新
  return toSafeUser(user); // 返回安全对象
}; // 结束 updateUser 定义
// ---------------------------- 分隔线 ----------------------------
export const deleteUser = async (id: number) => { // 导出删除用户的方法
  const repo = userRepository(); // 获取仓库实例
  const user = await repo.findOne({ where: { id } }); // 查询目标用户
  if (!user) { // 如果不存在
    throw new Error("User not found"); // 抛出异常
  } // 结束存在性判断
  await repo.remove(user); // 删除该用户
}; // 结束 deleteUser 定义
// ---------------------------- 分隔线 ----------------------------
export const validateUserCredentials = async (email: string, password: string) => { // 导出校验账号密码的方法
  const user = await findRawUserByEmail(email); // 先根据邮箱查找用户
  if (!user) { // 如果用户不存在
    return null; // 直接返回 null 表示校验失败
  } // 结束用户存在性判断
  const matches = await verifyPassword(password, user.password); // 使用 bcrypt 对比密码
  return matches ? user : null; // 匹配成功返回完整用户，失败返回 null
}; // 结束 validateUserCredentials 定义
// ---------------------------- 分隔线 ----------------------------
const toSafeUser = (user: User) => ({ // 将用户对象转换成不包含敏感信息的结构
  id: user.id, // 保留 ID
  email: user.email, // 保留邮箱
  name: user.name, // 保留姓名
  role: user.role, // 保留角色
  createdAt: user.createdAt, // 保留创建时间
  updatedAt: user.updatedAt // 保留更新时间
}); // 结束 toSafeUser 返回对象
