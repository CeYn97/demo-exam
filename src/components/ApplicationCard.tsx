import { useState } from 'react'
import type { FormEvent } from 'react'
import { useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'

import { applicationNumber, formatDate, reviewSchema } from '#/applications'
import { getMyApplications, submitReview } from '#/applications.functions'
import { fieldErrors } from '#/auth'
import { useFormErrors } from '#/components/useFormErrors'
import { courseLabels, paymentMethodLabels, statusLabels } from '#/labels'

type Application = Awaited<ReturnType<typeof getMyApplications>>[number]

export function ApplicationCard({ application }: { application: Application }) {
  return application.status === 'COMPLETED' ? (
    <ClosedCard application={application} />
  ) : (
    <OpenCard application={application} />
  )
}

function OpenCard({ application }: { application: Application }) {
  const inProgress = application.status === 'IN_PROGRESS'

  return (
    <article className={`sheet p-4 ${inProgress ? 'border-seal' : ''}`}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm text-muted">
          {applicationNumber(application.id)}
        </span>
        <span
          className={`text-sm font-semibold ${inProgress ? 'text-seal' : ''}`}
        >
          {statusLabels[application.status]}
        </span>
      </div>
      <h2 className="mt-1.5 mb-1 font-semibold">
        {courseLabels[application.course]}
      </h2>
      <p className="text-sm text-muted">
        С {formatDate(application.startDate)},{' '}
        {paymentMethodLabels[application.paymentMethod]}
      </p>
    </article>
  )
}

function focusElement(element: HTMLElement | null) {
  element?.focus()
}

function ClosedCard({ application }: { application: Application }) {
  const [writing, setWriting] = useState(false)
  const [returnFocus, setReturnFocus] = useState(false)
  const focusRef = returnFocus ? focusElement : undefined

  return (
    <article className="book-cover rounded-md px-4 pt-5 pb-4 text-center">
      <span className="text-sm text-ink-soft">
        {applicationNumber(application.id)}
      </span>
      <h2 className="mt-3 mb-3 font-stamp text-[25px] leading-[1.15] text-foil">
        {courseLabels[application.course]}
      </h2>
      <p className="text-sm font-medium text-white">
        {statusLabels[application.status]}
      </p>
      <p className="text-sm text-ink-soft">
        С {formatDate(application.startDate)}
      </p>

      {application.review ? (
        <div
          ref={focusRef}
          tabIndex={-1}
          className="mt-4 border-t border-foil/50 pt-3 text-left"
        >
          <h3 className="text-sm text-ink-soft">Ваш отзыв</h3>
          <p className="mt-1 break-words whitespace-pre-line text-white">
            {application.review.text}
          </p>
        </div>
      ) : writing ? (
        <ReviewForm
          applicationId={application.id}
          onSent={() => setReturnFocus(true)}
          onCancel={() => {
            setReturnFocus(true)
            setWriting(false)
          }}
        />
      ) : (
        <button
          ref={focusRef}
          type="button"
          onClick={() => setWriting(true)}
          className="btn-foil mt-4 w-full"
        >
          Оставить отзыв
        </button>
      )}
    </article>
  )
}

function ReviewForm({
  applicationId,
  onSent,
  onCancel,
}: {
  applicationId: number
  onSent: () => void
  onCancel: () => void
}) {
  const router = useRouter()
  const send = useServerFn(submitReview)
  const { formRef, errors, setErrors, showErrors } = useFormErrors()
  const [pending, setPending] = useState(false)
  const error = errors.text ?? errors.form

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    const text = String(new FormData(event.currentTarget).get('text'))
    const parsed = reviewSchema.safeParse({ applicationId, text })
    if (!parsed.success) {
      showErrors(fieldErrors(parsed.error))
      return
    }

    setErrors({})
    setPending(true)
    try {
      const result = await send({ data: parsed.data })
      if (!result) return
      if (result.ok) {
        onSent()
        await router.invalidate()
      } else {
        showErrors(result.errors)
      }
    } catch {
      setErrors({ form: 'Не получилось отправить отзыв. Попробуйте ещё раз' })
    } finally {
      setPending(false)
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      onChange={() => setErrors({})}
      noValidate
      className="mt-4 flex flex-col gap-2 text-left"
    >
      <label
        htmlFor={`review-${applicationId}`}
        className="text-sm font-medium text-white"
      >
        Ваш отзыв
      </label>
      <textarea
        id={`review-${applicationId}`}
        name="text"
        rows={4}
        autoFocus
        required
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `review-${applicationId}-error` : undefined}
        className="w-full rounded-sm bg-white px-3 py-2 text-ink aria-invalid:outline-2 aria-invalid:-outline-offset-2 aria-invalid:outline-foil"
      />
      {error && (
        <p id={`review-${applicationId}-error`} className="text-sm text-foil">
          {error}
        </p>
      )}
      <button type="submit" aria-disabled={pending} className="btn-foil">
        Отправить отзыв
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="min-h-11 cursor-pointer text-sm text-white underline underline-offset-3 hover:decoration-foil"
      >
        Отменить
      </button>
    </form>
  )
}
