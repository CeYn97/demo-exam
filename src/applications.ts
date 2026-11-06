import { z } from 'zod'

import { Course, PaymentMethod } from './generated/prisma/enums.js'

const REVIEW_MAX_LENGTH = 1000

// @db.Date хранит день по UTC: сравнение идёт с местным днём, записанным как полночь UTC.
function today() {
  const now = new Date()
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
}

export const applicationSchema = z.object({
  course: z.enum(Course, { error: 'Выберите курс' }),
  startDate: z.string().transform((value, ctx) => {
    const fail = (message: string) => {
      ctx.issues.push({ code: 'custom', message, input: value })
      return z.NEVER
    }

    const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value)
    if (!match) return fail('Введите дату в формате ДД.ММ.ГГГГ')

    const [day, month, year] = match.slice(1).map(Number)
    const date = new Date(Date.UTC(year, month - 1, day))
    if (date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
      return fail('Такой даты нет, проверьте день и месяц')
    }
    if (date < today()) return fail('Дата начала не может быть в прошлом')
    return date
  }),
  paymentMethod: z.enum(PaymentMethod, { error: 'Выберите способ оплаты' }),
})

export const reviewSchema = z.object({
  applicationId: z.number().int().positive(),
  text: z
    .string()
    .trim()
    .min(1, 'Напишите отзыв')
    .max(
      REVIEW_MAX_LENGTH,
      `Отзыв должен быть не длиннее ${REVIEW_MAX_LENGTH} символов`,
    ),
})

export type ApplicationInput = z.input<typeof applicationSchema>
export type ReviewInput = z.input<typeof reviewSchema>

// Точка появляется только перед следующей цифрой: иначе Backspace не может её удалить.
export function formatDateInput(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4)]
    .filter(Boolean)
    .join('.')
}

// timeZone обязателен: день в @db.Date приходит как полночь UTC и в поясах с отрицательным смещением сдвинется.
export function formatDate(date: Date) {
  return date.toLocaleDateString('ru-RU', {
    timeZone: 'UTC',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function applicationNumber(id: number) {
  return `№ ${String(id).padStart(4, '0')}`
}
