import {
  HeadContent,
  Link,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'

import { getCurrentUser } from '#/auth.functions'
import { AuthLayout } from '#/components/AuthLayout'
import { ToastProvider } from '#/components/Toast'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  beforeLoad: async () => ({ user: await getCurrentUser() }),
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        name: 'theme-color',
        content: '#283840',
      },
      {
        title: 'Корочки.есть',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'icon',
        href: '/favicon.ico',
        sizes: '32x32',
      },
      {
        rel: 'icon',
        href: '/favicon.svg',
        type: 'image/svg+xml',
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFoundPage,
  errorComponent: ErrorPage,
})

function ErrorPage() {
  return (
    <AuthLayout title="Не получилось открыть страницу">
      <p>Попробуйте ещё раз чуть позже.</p>
      {}
      <a href="/" className="btn-primary">
        На главную
      </a>
    </AuthLayout>
  )
}

function NotFoundPage() {
  return (
    <AuthLayout title="Страница не найдена">
      <p>Проверьте адрес или вернитесь на главную.</p>
      <Link to="/" className="btn-primary">
        На главную
      </Link>
    </AuthLayout>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <HeadContent />
      </head>
      <body>
        <ToastProvider>{children}</ToastProvider>
        <Scripts />
      </body>
    </html>
  )
}
