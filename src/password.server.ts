import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const SCRYPT_OPTIONS = { N: 2 ** 15, r: 8, p: 3, maxmem: 64 * 1024 * 1024 };
const KEY_LENGTH = 64;

function deriveKey(password: string, salt: string) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, KEY_LENGTH, SCRYPT_OPTIONS, (error, key) => {
      if (error) reject(error);
      else resolve(key);
    });
  });
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const key = await deriveKey(password, salt);
  return `${salt}:${key.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [salt, expected] = stored.split(":");
  const key = await deriveKey(password, salt);
  return timingSafeEqual(key, Buffer.from(expected, "hex"));
}
