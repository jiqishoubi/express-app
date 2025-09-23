import { AppDataSource } from "../../config/data-source";
import { User, Role } from "./user.entity";
import { hashPassword, verifyPassword } from "../../utils/password";

const userRepository = () => AppDataSource.getRepository(User); // 封装仓库获取，后续调用更简洁

export type CreateUserInput = {
  email: string;
  name: string;
  password: string;
  role?: Role;
};

export type UpdateUserInput = Partial<Omit<CreateUserInput, "password">> & {
  password?: string;
};

export const listUsers = async () => {
  const users = await userRepository().find();
  return users.map(toSafeUser); // 返回前去除密码等敏感字段
};

export const getUserById = async (id: number) => {
  const user = await userRepository().findOne({ where: { id } });
  return user ? toSafeUser(user) : null;
};

export const findRawUserByEmail = (email: string) =>
  userRepository().findOne({ where: { email } });

export const registerUser = async (input: CreateUserInput) => {
  const existing = await findRawUserByEmail(input.email);
  if (existing) {
    throw new Error("Email already registered");
  }
  const hashed = await hashPassword(input.password);
  const user = userRepository().create({
    email: input.email,
    name: input.name,
    password: hashed,
    role: input.role ?? "user"
  });
  await userRepository().save(user);
  return toSafeUser(user);
};

export const createUser = registerUser; // 管理员创建账号与普通注册复用同一套逻辑

export const updateUser = async (id: number, input: UpdateUserInput) => {
  const repo = userRepository();
  const user = await repo.findOne({ where: { id } });
  if (!user) {
    throw new Error("User not found");
  }

  if (input.email) user.email = input.email;
  if (input.name) user.name = input.name;
  if (input.role) user.role = input.role;
  if (input.password) {
    user.password = await hashPassword(input.password);
  }

  await repo.save(user);
  return toSafeUser(user);
};

export const deleteUser = async (id: number) => {
  const repo = userRepository();
  const user = await repo.findOne({ where: { id } });
  if (!user) {
    throw new Error("User not found");
  }
  await repo.remove(user);
};

export const validateUserCredentials = async (email: string, password: string) => {
  const user = await findRawUserByEmail(email);
  if (!user) {
    return null;
  }
  const matches = await verifyPassword(password, user.password);
  return matches ? user : null;
};

const toSafeUser = (user: User) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});
