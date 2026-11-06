import { prisma } from './db.js'
import { Prisma } from './generated/prisma/client.js'

export function findApplicationsOfUser(userId: number) {
  return prisma.application.findMany({
    where: { userId },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    select: {
      id: true,
      course: true,
      startDate: true,
      paymentMethod: true,
      status: true,
      review: { select: { text: true } },
    },
  })
}

// Второй отзыв отклоняет индекс базы: проверка перед вставкой не защищает от одновременных запросов.
export async function createReview(
  userId: number,
  applicationId: number,
  text: string,
) {
  const application = await prisma.application.findFirst({
    where: { id: applicationId, userId, status: 'COMPLETED' },
    select: { id: true },
  })
  if (!application) return false

  try {
    await prisma.review.create({ data: { applicationId, text } })
    return true
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return false
    }
    throw error
  }
}
