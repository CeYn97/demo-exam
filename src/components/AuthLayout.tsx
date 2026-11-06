import type { ReactNode } from 'react'

import { Brand } from '#/components/Brand'

type AuthLayoutProps = {
  title: string
  cover?: ReactNode
  children: ReactNode
}

export function AuthLayout({ title, cover, children }: AuthLayoutProps) {
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-[430px] flex-col bg-ink">
      <header className="book-cover flex flex-col gap-3 p-[21px]">
        <Brand large />
        {cover}
      </header>
      <main className="sheet mx-2 mb-2 flex flex-1 flex-col gap-4 px-3 pt-5 pb-3">
        <h1 className="text-2xl font-semibold">{title}</h1>
        {children}
      </main>
    </div>
  )
}
