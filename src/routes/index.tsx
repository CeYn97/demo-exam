import { createFileRoute, redirect } from '@tanstack/react-router'

import { homePath } from '#/auth'

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    throw redirect({
      to: context.user ? homePath(context.user.role) : '/login',
    })
  },
})
