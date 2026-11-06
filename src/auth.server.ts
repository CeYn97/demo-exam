import { randomUUID } from 'node:crypto'

import { redirect } from '@tanstack/react-router'
import {
  getCookie,
  getRequestProtocol,
  setCookie,
} from '@tanstack/react-start/server'
import { getIronSession } from 'iron-session'

import type { RegisterInput } from './auth.js'
import { prisma } from './db.js'
import { hashPassword, verifyPassword } from './password.server.js'

export function getSession() {
  const password = process.env.SESSION_SECRET
  if (!password || password.length < 32) {
    throw new Error('SESSION_SECRET: нужна случайная строка не короче 32 символов')
  }

  return getIronSession<{ userId?: number }>(
    { read: getCookie, write: setCookie },
    {
      cookieName: 'korochki_session',
      password,
      cookieOptions: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        // Не привязывать к NODE_ENV: WebKit и адреса в сети отбрасывают такую cookie на http, и вход молча не срабатывает.
        secure: getRequestProtocol() === 'https',
      },
    },
  )
}

// Роль читается из базы при каждом запросе: cookie хранит только id.
export async function getSessionUser() {
  const { userId } = await getSession()
  if (!userId) return null

  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, login: true, fullName: true, role: true },
  })
}

export async function requireUser() {
  const user = await getSessionUser()
  if (!user) throw redirect({ to: '/login' })
  return user
}

// Для неизвестного логина тоже считается scrypt, иначе по времени ответа видно, что логина нет.
const unknownUserHash = hashPassword(randomUUID())

export async function findUserByCredentials(login: string, password: string) {
  const user = await prisma.user.findUnique({ where: { login } })
  const valid = await verifyPassword(
    password,
    user?.passwordHash ?? (await unknownUserHash),
  )
  return user && valid ? user : null
}

// Поля перечислены явно: иначе запрос с role: 'ADMIN' создаст администратора.
export async function createUser({
  login,
  password,
  fullName,
  phone,
  email,
}: RegisterInput) {
  await prisma.user.create({
    data: {
      login,
      fullName,
      phone,
      email,
      passwordHash: await hashPassword(password),
    },
  })
}
