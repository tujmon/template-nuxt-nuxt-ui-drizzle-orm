import { existsSync } from 'node:fs'
import { mkdir, readdir, rm } from 'node:fs/promises'
import { dirname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn, type ChildProcess } from 'node:child_process'
import { chromium, type Browser, type BrowserContext } from '@playwright/test'

type ScreenshotUser = {
  name: string
  email: string
  password: string
}

type ScreenshotTarget = {
  route: string
  source: string
}

const rootDir = dirname(fileURLToPath(new URL('../package.json', import.meta.url)))
const pagesDir = join(rootDir, 'app/pages')
const outputDir = join(rootDir, process.env.SCREENSHOT_OUTPUT_DIR || 'screenshots')
const baseUrl = process.env.SCREENSHOT_BASE_URL || 'http://127.0.0.1:3000'
const authOrigin = new URL(process.env.BETTER_AUTH_URL || baseUrl).origin
const shouldStartServer = process.env.SCREENSHOT_START_SERVER !== 'false'
const routeParams = process.env.SCREENSHOT_ROUTE_PARAMS
  ? JSON.parse(process.env.SCREENSHOT_ROUTE_PARAMS) as Record<string, string>
  : {}
const viewport = {
  width: Number(process.env.SCREENSHOT_WIDTH || 1440),
  height: Number(process.env.SCREENSHOT_HEIGHT || 1000)
}

const defaultUsers: ScreenshotUser[] = [
  {
    name: 'user',
    email: process.env.SEED_USER_EMAIL || 'demo@example.com',
    password: process.env.SEED_USER_PASSWORD || 'password123'
  },
  {
    name: 'admin',
    email: process.env.SEED_ADMIN_EMAIL || 'admin@example.com',
    password: process.env.SEED_ADMIN_PASSWORD || 'admin123'
  }
]

const getUsers = (): ScreenshotUser[] => {
  if (!process.env.SCREENSHOT_USERS) return defaultUsers

  const users = JSON.parse(process.env.SCREENSHOT_USERS) as ScreenshotUser[]
  if (!Array.isArray(users) || users.length === 0) {
    throw new Error('SCREENSHOT_USERS must be a non-empty JSON array.')
  }

  return users
}

const waitForServer = async () => {
  const deadline = Date.now() + 60_000

  while (Date.now() < deadline) {
    try {
      const response = await fetch(baseUrl)
      if (response.status < 500) return
    } catch {
      // Server is still starting.
    }

    await new Promise(resolve => setTimeout(resolve, 500))
  }

  throw new Error(`Timed out waiting for ${baseUrl}`)
}

const isServerAvailable = async () => {
  try {
    const response = await fetch(baseUrl)
    return response.status < 500
  } catch {
    return false
  }
}

const startServer = async (): Promise<ChildProcess | null> => {
  if (await isServerAvailable()) {
    console.log(`Using existing server at ${baseUrl}`)
    return null
  }

  if (!shouldStartServer) {
    await waitForServer()
    return null
  }

  const url = new URL(baseUrl)
  const server = spawn(
    'npx',
    ['nuxt', 'dev', '--host', url.hostname, '--port', url.port || '3000'],
    {
      cwd: rootDir,
      env: {
        ...process.env,
        BETTER_AUTH_URL: baseUrl,
        NUXT_PORT: url.port || '3000',
        TMPDIR: process.env.TMPDIR || '/tmp'
      },
      stdio: 'inherit'
    }
  )

  await waitForServer()
  return server
}

const toRoute = (filePath: string) => {
  const relativePath = relative(pagesDir, filePath)
  const segments: string[] = []
  for (const segment of relativePath
    .replace(/\.vue$/, '')
    .split(sep)
    .filter(segment => segment !== 'index')) {
    if (segment.startsWith('[') && segment.endsWith(']')) {
      const paramName = segment.slice(1, -1).replace(/\.\.\./, '')
      const paramValue = routeParams[paramName]

      if (!paramValue) {
        console.warn(`Skipping ${relativePath}: missing SCREENSHOT_ROUTE_PARAMS.${paramName}`)
        return null
      }

      segments.push(paramValue)
    } else {
      segments.push(segment)
    }
  }

  return `/${segments.join('/')}`.replace(/\/$/, '') || '/'
}

const scanPages = async (dir: string): Promise<ScreenshotTarget[]> => {
  const entries = await readdir(dir, { withFileTypes: true })
  const nested = await Promise.all(entries.map(async (entry) => {
    const fullPath = join(dir, entry.name)

    if (entry.isDirectory()) return scanPages(fullPath)
    if (!entry.isFile() || !entry.name.endsWith('.vue')) return []

    const route = toRoute(fullPath)
    if (!route) return []

    return [{
      route,
      source: relative(rootDir, fullPath)
    }]
  }))

  return nested.flat().sort((a, b) => a.route.localeCompare(b.route))
}

const safeName = (value: string) => {
  if (value === '/') return 'home'
  return value.replace(/^\//, '').replace(/[^a-z0-9-]+/gi, '-').toLowerCase()
}

const login = async (context: BrowserContext, user: ScreenshotUser) => {
  const response = await context.request.post(new URL('/api/auth/sign-in/email', baseUrl).toString(), {
    headers: {
      origin: authOrigin
    },
    data: {
      email: user.email,
      password: user.password
    }
  })

  if (!response.ok()) {
    throw new Error(`Failed to sign in "${user.name}" with status ${response.status()}: ${await response.text()}`)
  }
}

const screenshotRoute = async (
  context: BrowserContext,
  profileName: string,
  target: ScreenshotTarget
) => {
  const page = await context.newPage()
  const url = new URL(target.route, baseUrl).toString()
  const filePath = join(outputDir, profileName, `${safeName(target.route)}.png`)

  await mkdir(dirname(filePath), { recursive: true })
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.screenshot({ path: filePath, fullPage: true })
  await page.close()

  console.log(`${profileName}: ${target.route} -> ${relative(rootDir, filePath)}`)
}

const captureForProfile = async (
  browser: Browser,
  profileName: string,
  targets: ScreenshotTarget[],
  user?: ScreenshotUser
) => {
  const context = await browser.newContext({ viewport })

  if (user) {
    await login(context, user)
  }

  for (const target of targets) {
    await screenshotRoute(context, profileName, target)
  }

  await context.close()
}

const main = async () => {
  if (!existsSync(pagesDir)) {
    throw new Error(`Pages directory not found: ${pagesDir}`)
  }

  const targets = await scanPages(pagesDir)
  const users = getUsers()
  let server: ChildProcess | null = null

  await rm(outputDir, { recursive: true, force: true })
  server = await startServer()

  const browser = await chromium.launch()
  try {
    await captureForProfile(browser, 'public', targets)

    for (const user of users) {
      await captureForProfile(browser, user.name, targets, user)
    }
  } finally {
    await browser.close()
    server?.kill()
  }

  console.log(`Saved ${targets.length * (users.length + 1)} screenshots in ${relative(rootDir, outputDir)}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
