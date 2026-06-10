/* eslint-disable no-console */
import { spawn, spawnSync } from 'node:child_process'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { appThemes } from '../app/themes'

const rootDir = dirname(fileURLToPath(new URL('../package.json', import.meta.url)))
const composeFile = 'docker-compose.screenshots.yml'
const projectName = process.env.SCREENSHOT_DOCKER_PROJECT || 'template-nuxt-screenshots'
const appPort = Number(process.env.SCREENSHOT_DOCKER_APP_PORT || 3300)
const dbPort = Number(process.env.SCREENSHOT_DOCKER_DB_PORT || 55432)
const baseUrl = process.env.SCREENSHOT_DOCKER_BASE_URL || `http://127.0.0.1:${appPort}`
const statusUrl = new URL('/api/v1/status', baseUrl).toString()
const useThemes = process.argv.includes('--themes')
const themeNames = useThemes
  ? process.env.SCREENSHOT_THEMES
    ? process.env.SCREENSHOT_THEMES.split(',')
        .map((theme) => theme.trim())
        .filter(Boolean)
    : Object.keys(appThemes)
  : [process.env.NUXT_UI_THEME || 'default']

const compose = (...args: string[]) => [
  'docker',
  'compose',
  '-p',
  projectName,
  '-f',
  composeFile,
  ...args
]

const run = async (command: string[], env: NodeJS.ProcessEnv = process.env) => {
  console.log(`$ ${command.join(' ')}`)

  const [cmd, ...args] = command
  if (!cmd) {
    throw new Error('Command array cannot be empty')
  }

  await new Promise<void>((resolve, reject) => {
    const child = spawn(cmd, args, {
      cwd: rootDir,
      env,
      stdio: 'inherit'
    })

    child.on('exit', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Command failed with exit code ${code}: ${command.join(' ')}`))
      }
    })
  })
}

const runQuiet = (command: string[], env: NodeJS.ProcessEnv = process.env) => {
  const [cmd, ...args] = command
  if (!cmd) return false

  return (
    spawnSync(cmd, args, {
      cwd: rootDir,
      env,
      stdio: 'ignore'
    }).status === 0
  )
}

const waitForStatus = async () => {
  const deadline = Date.now() + Number(process.env.SCREENSHOT_DOCKER_WAIT_MS || 120_000)

  while (Date.now() < deadline) {
    try {
      const response = await fetch(statusUrl)
      if (response.ok) return
    } catch {
      // App is still starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 1_000))
  }

  throw new Error(`Timed out waiting for ${statusUrl}`)
}

const validateTheme = (themeName: string) => {
  if (!(themeName in appThemes)) {
    throw new Error(
      `Unknown screenshot theme "${themeName}". Available themes: ${Object.keys(appThemes).join(', ')}`
    )
  }
}

const dockerEnv = (themeName: string): NodeJS.ProcessEnv => ({
  ...process.env,
  NUXT_UI_THEME: themeName,
  SCREENSHOT_DOCKER_APP_PORT: String(appPort),
  SCREENSHOT_DOCKER_DB_PORT: String(dbPort),
  SCREENSHOT_DOCKER_BASE_URL: baseUrl,
  BETTER_AUTH_URL: baseUrl
})

const hostEnv = (themeName: string): NodeJS.ProcessEnv => ({
  ...process.env,
  NUXT_UI_THEME: themeName,
  SCREENSHOT_START_SERVER: 'false',
  SCREENSHOT_BASE_URL: baseUrl,
  SCREENSHOT_OUTPUT_DIR: useThemes ? `screenshots/themes/${themeName}` : 'screenshots/docker',
  BETTER_AUTH_URL: baseUrl
})

const resetEnvironment = async (env: NodeJS.ProcessEnv) => {
  await run(compose('down', '--volumes', '--remove-orphans'), env)
  await run(compose('up', '-d', 'postgres'), env)
}

const prepareProject = async (env: NodeJS.ProcessEnv) => {
  await run(compose('run', '--rm', 'app', 'npm', 'ci', '--include=dev', '--ignore-scripts'), env)
  await run(compose('run', '--rm', 'app', 'npx', 'nuxt', 'prepare'), env)
  await run(compose('run', '--rm', 'app', 'npm', 'run', 'db:migrate'), env)
  await run(compose('run', '--rm', 'app', 'npm', 'run', 'db:seed:reset'), env)
  await run(compose('run', '--rm', 'app', 'npm', 'run', 'build'), env)
}

const captureTheme = async (themeName: string) => {
  validateTheme(themeName)

  const env = dockerEnv(themeName)
  console.log(`Preparing isolated screenshot environment for theme "${themeName}" at ${baseUrl}`)

  await resetEnvironment(env)
  await prepareProject(env)
  await run(compose('up', '-d', 'app'), env)
  await waitForStatus()
  await run(['npm', 'run', 'screenshots'], hostEnv(themeName))
}

try {
  for (const themeName of themeNames) {
    await captureTheme(themeName)
  }
} finally {
  if (process.env.SCREENSHOT_DOCKER_KEEP_ALIVE !== 'true') {
    const env = dockerEnv(themeNames[themeNames.length - 1] || 'default')
    runQuiet(compose('down', '--volumes', '--remove-orphans'), env)
  }
}

console.log(`Captured Docker screenshots for themes: ${themeNames.join(', ')}`)
