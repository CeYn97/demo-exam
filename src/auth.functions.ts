import { createServerFn } from '@tanstack/react-start'

import type { LoginInput, RegisterInput } from './auth.js'
import { homePath } from './auth.js'
import {
  createUser,
  findUserByCredentials,
  getSession,
  getSessionUser,
} from './auth.server.js'

export const getCurrentUser = createServerFn({ method: 'GET' }).handler(() =>
  getSessionUser(),
)

export const registerUser = createServerFn({ method: 'POST' })
  .validator((data: RegisterInput) => data)
  .handler(({ data }) => createUser(data))

export const loginUser = createServerFn({ method: 'POST' })
  .validator((data: LoginInput) => data)
  .handler(
    async ({
      data,
    }): Promise<
      { ok: true; home: ReturnType<typeof homePath> } | { ok: false; error: string }
    > => {
      const user = await findUserByCredentials(data.login, data.password)
      if (!user) return { ok: false, error: 'Неверный логин или пароль' }

      const session = await getSession()
      session.userId = user.id
      await session.save()
      return { ok: true, home: homePath(user.role) }
    },
  )

export const logoutUser = createServerFn({ method: 'POST' }).handler(
  async () => {
    const session = await getSession()
    session.destroy()
  },
)
