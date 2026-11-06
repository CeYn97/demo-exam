import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'

import { applicationSchema, formatDateInput } from '#/applications'
import type { ApplicationInput } from '#/applications'
import { submitApplication } from '#/applications.functions'
import { fieldErrors } from '#/auth'
import { FormField } from '#/components/FormField'
import { SelectField } from '#/components/SelectField'
import { useToast } from '#/components/Toast'
import { useFormErrors } from '#/components/useFormErrors'
import { courseLabels, paymentMethodLabels } from '#/labels'

export const Route = createFileRoute('/_user/new-application')({
  head: () => ({ meta: [{ title: 'Новая заявка | Корочки.есть' }] }),
  component: NewApplicationPage,
})

function NewApplicationPage() {
  const navigate = useNavigate()
  const showToast = useToast()
  const send = useServerFn(submitApplication)
  const [startDate, setStartDate] = useState('')
  const { formRef, errors, setErrors, showErrors, clearError } = useFormErrors()
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    const values = Object.fromEntries(new FormData(event.currentTarget))
    const parsed = applicationSchema.safeParse(values)
    if (!parsed.success) {
      showErrors(fieldErrors(parsed.error))
      return
    }

    setErrors({})
    setPending(true)
    try {
      // На сервер уходят исходные строки: дату в Date превращает схема уже там.
      const result = await send({ data: values as ApplicationInput })
      // При истёкшей сессии useServerFn сам переходит на вход и возвращает undefined.
      if (!result) return
      if (result.ok) {
        showToast('Заявка отправлена')
        await navigate({ to: '/applications' })
      } else {
        showErrors(result.errors)
      }
    } catch {
      setErrors({ form: 'Не получилось отправить заявку. Попробуйте ещё раз' })
    } finally {
      setPending(false)
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-5">
      <h1 className="mb-4 text-2xl font-semibold">Новая заявка</h1>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        onChange={clearError}
        noValidate
        className="sheet flex flex-col gap-4 p-4"
      >
        <SelectField
          label="Курс"
          name="course"
          placeholder="Выберите курс"
          options={Object.entries(courseLabels)}
          required
          error={errors.course}
        />
        <FormField
          label="Желаемая дата начала обучения"
          name="startDate"
          inputMode="numeric"
          autoComplete="off"
          placeholder="ДД.ММ.ГГГГ"
          required
          value={startDate}
          onChange={(event) => setStartDate(formatDateInput(event.target.value))}
          error={errors.startDate}
        />

        <fieldset
          aria-describedby={errors.paymentMethod ? 'payment-error' : undefined}
          className="flex flex-col gap-1"
        >
          <legend className="mb-1 text-sm font-medium">Способ оплаты</legend>
          {Object.entries(paymentMethodLabels).map(([value, label]) => (
            <label
              key={value}
              className="flex min-h-12 cursor-pointer items-center gap-3 rounded-sm border border-field px-3 py-2 transition-colors hover:border-ink has-checked:border-seal has-[input[aria-invalid=true]]:border-error"
            >
              <input
                type="radio"
                name="paymentMethod"
                value={value}
                required
                aria-invalid={Boolean(errors.paymentMethod)}
                className="size-5 shrink-0 cursor-pointer"
              />
              <span className="block first-letter:uppercase">{label}</span>
            </label>
          ))}
          {errors.paymentMethod && (
            <p id="payment-error" className="text-sm text-error">
              {errors.paymentMethod}
            </p>
          )}
        </fieldset>

        {errors.form && (
          <p role="alert" className="text-sm text-error">
            {errors.form}
          </p>
        )}

        <button type="submit" aria-disabled={pending} className="btn-primary">
          Отправить
        </button>
        <Link to="/applications" className="text-link">
          Вернуться к заявкам
        </Link>
      </form>
    </main>
  )
}
