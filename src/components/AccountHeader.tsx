import { useNavigate } from '@tanstack/react-router'

import { logoutUser } from '#/auth.functions'
import { Brand } from '#/components/Brand'

export function AccountHeader({ fullName }: { fullName: string }) {
  const navigate = useNavigate()

  async function handleLogout() {
    await logoutUser()
    await navigate({ to: '/login' })
  }

  return (
    <header className="book-cover">
      <div className="mx-auto flex max-w-md items-center justify-between gap-4 px-4 pt-1">
        <Brand />
        <button
          type="button"
          onClick={handleLogout}
          className="h-11 min-w-11 shrink-0 cursor-pointer text-sm text-white underline underline-offset-3 hover:decoration-foil"
        >
          Выйти
        </button>
      </div>
      <p className="mx-auto max-w-md truncate px-4 pb-3 text-sm text-ink-soft">
        {fullName}
      </p>
    </header>
  )
}
