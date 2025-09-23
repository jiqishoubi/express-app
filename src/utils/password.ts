import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10; // 值越大越安全，但哈希耗时也会更久

export const hashPassword = (plain: string) => bcrypt.hash(plain, SALT_ROUNDS);

export const verifyPassword = (plain: string, hashed: string) => bcrypt.compare(plain, hashed);
