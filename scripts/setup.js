import { spawnSync } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { setTimeout as sleep } from 'node:timers/promises'

const container = 'demo'

function fail(message) {
  console.error(message)
  process.exit(1)
}

function docker(args, stdio = 'ignore') {
  return spawnSync('docker', args, { stdio }).status === 0
}

function prepareEnv() {
  const env = readFileSync(existsSync('.env') ? '.env' : '.env.example', 'utf8')
  const secret = randomBytes(32).toString('hex')
  writeFileSync('.env', env.replace(/^SESSION_SECRET=""$/m, `SESSION_SECRET="${secret}"`))
}

function dockerOutput(args) {
  return spawnSync('docker', args, { encoding: 'utf8' }).stdout.trim()
}

function startContainer() {
  const state = dockerOutput(['inspect', '-f', '{{.State.Status}}', container])

  if (state === 'created') docker(['rm', '-v', container])

  if (state !== 'running') {
    const args =
      state === '' || state === 'created'
        ? ['run', '-d', '-p=5431:5432', '-e', 'POSTGRES_PASSWORD=postgres', '-e', 'POSTGRES_DB=demo', `--name=${container}`, 'postgres:18']
        : ['start', container]
    if (!docker(args, 'inherit')) {
      fail(`Не удалось запустить контейнер ${container}. Проверьте, что порт 5431 свободен, и повторите npm run setup.`)
    }
  }

  if (!dockerOutput(['port', container, '5432']).includes(':5431')) {
    fail(`Контейнер ${container} работает без порта 5431. Пересоздайте его командой docker rm -f ${container} (данные в нём пропадут) и повторите npm run setup.`)
  }
}

async function waitForDatabase() {
  for (let attempt = 0; attempt < 60; attempt++) {
    if (docker(['exec', container, 'pg_isready', '-h', '127.0.0.1', '-U', 'postgres'])) return
    await sleep(1000)
  }
  fail(`База не запустилась за минуту. Журнал контейнера: docker logs ${container}`)
}

function runScript(script) {
  const { status } = spawnSync('npm', ['run', script], {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })
  if (status !== 0) fail(`Команда npm run ${script} завершилась с ошибкой.`)
}

if (!docker(['info'])) {
  fail('Docker не запущен или не установлен. Запустите его и повторите npm run setup.')
}

prepareEnv()
startContainer()
await waitForDatabase()
runScript('db:push')
runScript('db:generate')
runScript('db:seed')

console.log('\nБаза готова. Запуск приложения: npm run dev')
