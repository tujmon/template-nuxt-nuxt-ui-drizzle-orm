import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { describe, expect, it } from 'vitest'

const projectRoot = process.cwd()

const toProjectPath = (filePath: string) => relative(projectRoot, filePath).split(sep).join('/')

const listFiles = (directory: string): string[] => {
  const absoluteDirectory = join(projectRoot, directory)

  if (!existsSync(absoluteDirectory)) {
    return []
  }

  return readdirSync(absoluteDirectory).flatMap((entry) => {
    const absoluteEntry = join(absoluteDirectory, entry)
    const stats = statSync(absoluteEntry)

    if (stats.isDirectory()) {
      return listFiles(toProjectPath(absoluteEntry))
    }

    return [toProjectPath(absoluteEntry)]
  })
}

const readProjectFile = (filePath: string) => readFileSync(join(projectRoot, filePath), 'utf8')

const sourceFiles = (...directories: string[]) =>
  directories
    .flatMap((directory) => listFiles(directory))
    .filter((filePath) => /\.(ts|vue)$/.test(filePath))

describe('project architecture guardrails', () => {
  it('keeps application API routes versioned under /api/v1', () => {
    const allowedUnversionedRoutes = ['server/api/auth/', 'server/api/telemetry/']

    const routeViolations = listFiles('server/api')
      .filter((filePath) => filePath.endsWith('.ts'))
      .filter((filePath) => !filePath.startsWith('server/api/v1/'))
      .filter((filePath) => !allowedUnversionedRoutes.some((prefix) => filePath.startsWith(prefix)))

    expect(routeViolations).toEqual([])
  })

  it('validates mutating API payloads with shared Zod schemas', () => {
    const mutatingRouteViolations = listFiles('server/api')
      .filter((filePath) => /\.(post|patch|put)\.ts$/.test(filePath))
      .filter((filePath) => !filePath.startsWith('server/api/auth/'))
      .filter((filePath) => {
        const contents = readProjectFile(filePath)
        return !contents.includes('shared/validation') || !/(safeParse|parse)\(/.test(contents)
      })

    expect(mutatingRouteViolations).toEqual([])
  })

  it('keeps API handlers away from direct database access except operational status', () => {
    const databaseAccessViolations = listFiles('server/api')
      .filter((filePath) => filePath.endsWith('.ts'))
      .filter((filePath) => filePath !== 'server/api/v1/status.get.ts')
      .filter((filePath) => readProjectFile(filePath).includes('server/database/client'))

    expect(databaseAccessViolations).toEqual([])
  })

  it('centralizes server environment reads in server/utils/env.ts', () => {
    const envReadViolations = sourceFiles('server')
      .filter((filePath) => filePath !== 'server/utils/env.ts')
      .filter((filePath) => readProjectFile(filePath).includes('process.env'))

    expect(envReadViolations).toEqual([])
  })

  it('keeps runtime app code free from console calls', () => {
    const runtimeConsoleViolations = sourceFiles(
      'app/components',
      'app/composables',
      'app/layouts',
      'app/middleware',
      'app/pages',
      'app/utils',
      'server',
      'shared'
    ).filter((filePath) => /\bconsole\./.test(readProjectFile(filePath)))

    expect(runtimeConsoleViolations).toEqual([])
  })

  it('requires explicit auth metadata on every page', () => {
    const pageMetaViolations = listFiles('app/pages')
      .filter((filePath) => filePath.endsWith('.vue'))
      .filter((filePath) => {
        const contents = readProjectFile(filePath)
        return (
          !contents.includes('definePageMeta') ||
          !/auth:\s*['"](public|guest|protected)['"]/.test(contents)
        )
      })

    expect(pageMetaViolations).toEqual([])
  })

  it('wraps the Nuxt app with Nuxt UI UApp', () => {
    expect(existsSync(join(projectRoot, 'app/app.vue'))).toBe(true)
    expect(readProjectFile('app/app.vue')).toContain('<UApp>')
  })

  it('centralizes Nuxt UI theme configuration in app.config.ts', () => {
    expect(existsSync(join(projectRoot, 'app/app.config.ts'))).toBe(true)
    expect(existsSync(join(projectRoot, 'app/themes/index.ts'))).toBe(true)
    expect(existsSync(join(projectRoot, 'app/plugins/theme.ts'))).toBe(true)

    const contents = readProjectFile('app/app.config.ts')
    const plugin = readProjectFile('app/plugins/theme.ts')
    const nuxtConfig = readProjectFile('nuxt.config.ts')

    expect(contents).toContain('defineAppConfig')
    expect(plugin).toContain('updateAppConfig')
    expect(plugin).toContain('getAppTheme')
    expect(nuxtConfig).toContain('uiTheme')
    expect(nuxtConfig).toContain('NUXT_UI_THEME')
  })

  it('keeps agent documentation workspace-relative', () => {
    const absoluteAgentLinks = listFiles('.')
      .filter((filePath) => filePath.endsWith('AGENT.md'))
      .filter((filePath) => readProjectFile(filePath).includes('file:///Users/'))

    expect(absoluteAgentLinks).toEqual([])
  })

  it('keeps operational scripts in TypeScript', () => {
    const scriptViolations = listFiles('scripts').filter((filePath) =>
      /\.(js|mjs|cjs)$/.test(filePath)
    )

    expect(scriptViolations).toEqual([])
  })

  it('keeps screenshot automation isolated from the default dev database', () => {
    expect(existsSync(join(projectRoot, 'docker-compose.screenshots.yml'))).toBe(true)
    expect(existsSync(join(projectRoot, 'scripts/screenshot-docker.ts'))).toBe(true)

    const packageJson = readProjectFile('package.json')
    const composeFile = readProjectFile('docker-compose.screenshots.yml')
    const dockerScript = readProjectFile('scripts/screenshot-docker.ts')

    expect(packageJson).toContain('screenshots:docker')
    expect(packageJson).toContain('screenshots:themes:docker')
    expect(composeFile).toContain('SCREENSHOT_DOCKER_APP_PORT')
    expect(composeFile).toContain('SCREENSHOT_DOCKER_DB_PORT')
    expect(composeFile).toContain('screenshot_postgres_data')
    expect(composeFile).toContain('/api/v1/status')
    expect(dockerScript).toContain('db:seed:reset')
    expect(dockerScript).toContain('SCREENSHOT_START_SERVER')
    expect(dockerScript).toContain('waitForStatus')
  })

  it('documents server environment variables in example env files', () => {
    const requiredVariables = [
      'DATABASE_URL',
      'BETTER_AUTH_SECRET',
      'BETTER_AUTH_URL',
      'STATUS_EXPOSE_DETAILS',
      'RATE_LIMIT_ENABLED',
      'RATE_LIMIT_WINDOW_MS',
      'RATE_LIMIT_MAX_REQUESTS',
      'TELEMETRY_RATE_LIMIT_MAX_REQUESTS'
    ]
    const envExample = readProjectFile('.env.example')
    const envTest = readProjectFile('.env.test')
    const missingVariables = requiredVariables.filter((variable) => {
      return !envExample.includes(`${variable}=`) || !envTest.includes(`${variable}=`)
    })

    expect(missingVariables).toEqual([])
  })
})
