import type { z } from 'zod'

import type { Role } from './generated/prisma/enums.js'

export type RegisterInput = {
  login: string
  password: string
  fullName: string
  phone: string
  email: string
}
export type LoginInput = { login: string; password: string }
export type FormErrors = Record<string, string>

export function fieldErrors(error: z.ZodError): FormErrors {
  const errors: FormErrors = {}
  for (const issue of error.issues) {
    errors[String(issue.path[0])] ??= issue.message
  }
  return errors
}

export function homePath(role: Role) {
  return role === 'ADMIN' ? '/admin' : '/applications'
}
