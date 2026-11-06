import { PrismaClient } from '../src/generated/prisma/client.js'

import { getDatabaseUrl } from '../src/database-url.js'
import { hashPassword } from '../src/password.server.js'

import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: getDatabaseUrl(),
})

const prisma = new PrismaClient({ adapter })

const ADMIN_PASSWORD = 'KorokNET'

const admin = {
  login: 'Admin',
  fullName: 'Администратор портала',
  phone: '8(900)000-00-00',
  email: 'admin@example.com',
}

async function main() {
  const existing = await prisma.user.findUnique({
    where: { login: admin.login },
  })
  if (existing) {
    console.log('Администратор уже создан')
    return
  }

  await prisma.user.create({
    data: {
      ...admin,
      passwordHash: await hashPassword(ADMIN_PASSWORD),
      role: 'ADMIN',
    },
  })

  console.log('Создан администратор Admin')
}

main()
  .catch((error) => {
    console.error('Ошибка заполнения базы:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
