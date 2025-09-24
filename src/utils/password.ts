import bcrypt from "bcryptjs"; // 引入 bcryptjs 实现密码哈希
// ---------------------------- 分隔线 ----------------------------
const SALT_ROUNDS = 10; // 定义哈希强度，值越大越安全但耗时越久
// ---------------------------- 分隔线 ----------------------------
export const hashPassword = (plain: string) => bcrypt.hash(plain, SALT_ROUNDS); // 将明文密码加盐哈希
// ---------------------------- 分隔线 ----------------------------
export const verifyPassword = (plain: string, hashed: string) => bcrypt.compare(plain, hashed); // 对比明文与哈希，返回是否匹配
