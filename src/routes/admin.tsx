import { createFileRoute, redirect } from '@tanstack/react-router'

import { homePath } from '#/auth'
import { AccountHeader } from '#/components/AccountHeader'

export const Route = createFileRoute('/admin')({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: '/login' })
    if (context.user.role !== 'ADMIN') {
      throw redirect({ to: homePath(context.user.role) })
    }
    return { user: context.user }
  },
  head: () => ({ meta: [{ title: 'Панель администратора | Корочки.есть' }] }),
  component: AdminPage,
})

function AdminPage() {
  const { user } = Route.useRouteContext()

  return (
    <>
      <AccountHeader fullName={user.fullName} />
      <main className="mx-auto max-w-md px-4 py-5">
        <h1 className="text-2xl font-semibold">Панель администратора</h1>
      </main>
    </>
  )
}
