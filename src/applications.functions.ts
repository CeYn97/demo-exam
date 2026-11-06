import { createServerFn } from '@tanstack/react-start'

import type { ApplicationInput, ReviewInput } from './applications.js'
import { applicationSchema, reviewSchema } from './applications.js'
import { createReview, findApplicationsOfUser } from './applications.server.js'
import type { FormErrors } from './auth.js'
import { fieldErrors } from './auth.js'
import { requireUser } from './auth.server.js'
import { prisma } from './db.js'

type Result = { ok: true } | { ok: false; errors: FormErrors }

export const getMyApplications = createServerFn({ method: 'GET' }).handler(
  async () => {
    const user = await requireUser()
    return findApplicationsOfUser(user.id)
  },
)

export const submitApplication = createServerFn({ method: 'POST' })
  .validator((data: ApplicationInput) => data)
  .handler(async ({ data }): Promise<Result> => {
    const user = await requireUser()
    const parsed = applicationSchema.safeParse(data)
    if (!parsed.success) {
      return { ok: false, errors: fieldErrors(parsed.error) }
    }

    await prisma.application.create({
      data: { ...parsed.data, userId: user.id },
    })
    return { ok: true }
  })

export const submitReview = createServerFn({ method: 'POST' })
  .validator((data: ReviewInput) => data)
  .handler(async ({ data }): Promise<Result> => {
    const user = await requireUser()
    const parsed = reviewSchema.safeParse(data)
    if (!parsed.success) {
      return { ok: false, errors: fieldErrors(parsed.error) }
    }

    const created = await createReview(
      user.id,
      parsed.data.applicationId,
      parsed.data.text,
    )
    return created
      ? { ok: true }
      : { ok: false, errors: { form: 'Отзыв к этой заявке оставить нельзя' } }
  })
