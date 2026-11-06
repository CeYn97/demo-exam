import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

import { homePath } from '#/auth'
import { AccountHeader } from '#/components/AccountHeader'

export const Route = createFileRoute('/_user')({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: '/login' })
    if (context.user.role !== 'USER') {
      throw redirect({ to: homePath(context.user.role) })
    }
    return { user: context.user }
  },
  component: UserLayout,
})

function UserLayout() {
  const { user } = Route.useRouteContext()

  return (
    <>
      <AccountHeader fullName={user.fullName} />
      <Outlet />
    </>
  )
}
