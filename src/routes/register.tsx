import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, createFileRoute, redirect, useNavigate } from '@tanstack/react-router'

import { homePath } from '#/auth'
import type { RegisterInput } from '#/auth'
import { registerUser } from '#/auth.functions'
import { AuthLayout } from '#/components/AuthLayout'
import { FormField } from '#/components/FormField'
import { formatPhone } from '#/phone'

export const Route = createFileRoute('/register')({
  beforeLoad: ({ context }) => {
    if (context.user) throw redirect({ to: homePath(context.user.role) })
  },
  head: () => ({ meta: [{ title: 'Регистрация | Корочки.есть' }] }),
  component: RegisterPage,
})

function RegisterPage() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    const data = Object.fromEntries(
      new FormData(event.currentTarget),
    ) as RegisterInput

    setError('')
    setPending(true)
    try {
      await registerUser({ data })
      await navigate({ to: '/login', search: { registered: true } })
    } catch {
      setError('Не получилось зарегистрироваться. Попробуйте ещё раз')
    } finally {
      setPending(false)
    }
  }

  return (
    <AuthLayout title="Регистрация">
      {/* noValidate: без него браузер покажет свою ошибку для type="email". */}
      <form
        onSubmit={handleSubmit}
        onChange={() => setError('')}
        noValidate
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
          autoComplete="new-password"
        />
        <FormField label="ФИО" name="fullName" autoComplete="name" />
        <FormField
          label="Телефон"
          name="phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="8(XXX)XXX-XX-XX"
          value={phone}
          onChange={(event) => setPhone(formatPhone(event.target.value))}
        />
        <FormField
          label="Адрес электронной почты"
          name="email"
          type="email"
          autoComplete="email"
          autoCapitalize="none"
        />

        {error && (
          <p role="alert" className="text-sm text-error">
            {error}
          </p>
        )}

        <button type="submit" aria-disabled={pending} className="btn-primary">
          Зарегистрироваться
        </button>
      </form>

      <Link to="/login" className="text-link">
        Уже зарегистрированы? Войти
      </Link>
    </AuthLayout>
  )
}
