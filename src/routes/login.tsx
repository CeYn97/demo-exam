import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, createFileRoute, redirect, useNavigate } from '@tanstack/react-router'

import { homePath } from '#/auth'
import type { LoginInput } from '#/auth'
import { loginUser } from '#/auth.functions'
import { AuthLayout } from '#/components/AuthLayout'
import { FormField } from '#/components/FormField'
import { PhotoSlider } from '#/components/PhotoSlider'

export const Route = createFileRoute('/login')({
  validateSearch: (search): { registered?: true } =>
    search.registered === true ? { registered: true } : {},
  beforeLoad: ({ context }) => {
    if (context.user) throw redirect({ to: homePath(context.user.role) })
  },
  head: () => ({ meta: [{ title: 'Вход | Корочки.есть' }] }),
  component: LoginPage,
})

function LoginPage() {
  const { registered } = Route.useSearch()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    const data = Object.fromEntries(
      new FormData(event.currentTarget),
    ) as LoginInput

    setError('')
    setPending(true)
    try {
      const result = await loginUser({ data })
      if (result.ok) await navigate({ to: result.home })
      else setError(result.error)
    } catch {
      setError('Не получилось войти. Попробуйте ещё раз')
    } finally {
      setPending(false)
    }
  }

  return (
    <AuthLayout title="Вход" cover={<PhotoSlider />}>
      {registered && (
        <p
          role="status"
          className="rounded-sm border border-line bg-ground px-3 py-2 text-sm"
        >
          Регистрация прошла успешно. Теперь войдите.
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        onChange={() => setError('')}
        className="flex flex-col gap-4"
      >
        <FormField
          label="Логин"
          name="login"
          autoComplete="username"
          autoCapitalize="none"
        />
        <FormField
          label="Пароль"
          name="password"
          type="password"
          autoComplete="current-password"
        />

        {error && (
          <p role="alert" className="text-sm text-error">
            {error}
          </p>
        )}

        <button type="submit" aria-disabled={pending} className="btn-primary">
          Войти
        </button>
      </form>

      <Link to="/register" className="text-link">
        Еще не зарегистрированы? Регистрация
      </Link>
    </AuthLayout>
  )
}
