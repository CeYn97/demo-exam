import type {
  ApplicationStatus,
  Course,
  PaymentMethod,
} from './generated/prisma/enums.js'

export const courseLabels: Record<Course, string> = {
  ALGORITHMS: 'Основы алгоритмизации и программирования',
  WEB_DESIGN: 'Основы веб-дизайна',
  DATABASES: 'Основы проектирования баз данных',
}

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  CASH: 'наличными',
  PHONE_TRANSFER: 'переводом по номеру телефона',
}

export const statusLabels: Record<ApplicationStatus, string> = {
  NEW: 'Новая',
  IN_PROGRESS: 'Идет обучение',
  COMPLETED: 'Обучение завершено',
}
