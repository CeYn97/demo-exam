import { Link, createFileRoute } from '@tanstack/react-router'

import { getMyApplications } from '#/applications.functions'
import { ApplicationCard } from '#/components/ApplicationCard'

export const Route = createFileRoute('/_user/applications')({
  head: () => ({ meta: [{ title: 'Мои заявки | Корочки.есть' }] }),
  loader: () => getMyApplications(),
  component: ApplicationsPage,
})

function ApplicationsPage() {
  const applications = Route.useLoaderData()

  if (applications.length === 0) {
    return (
      <main className="mx-auto max-w-md px-4 py-5">
        <h1 className="text-2xl font-semibold">Мои заявки</h1>
        <div className="sheet mt-4 flex flex-col gap-4 p-4">
          <p>Заявок пока нет</p>
          <Link to="/new-application" className="btn-primary">
            Новая заявка
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-md px-4 py-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Мои заявки</h1>
        <Link to="/new-application" className="btn-primary shrink-0 px-4">
          Новая заявка
        </Link>
      </div>
      <ul className="flex flex-col gap-2.5">
        {applications.map((application) => (
          <li key={application.id}>
            <ApplicationCard application={application} />
          </li>
        ))}
      </ul>
    </main>
  )
}
