import { spawn } from 'node:child_process'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { appThemes } from '../app/themes'

const rootDir = dirname(fileURLToPath(new URL('../package.json', import.meta.url)))
const basePort = Number(process.env.SCREENSHOT_THEME_BASE_PORT || 3200)
const themeNames = process.env.SCREENSHOT_THEMES
  ? process.env.SCREENSHOT_THEMES.split(',').map(theme => theme.trim()).filter(Boolean)
  : Object.keys(appThemes)

const runTheme = async (themeName: string, index: number) => {
  if (!(themeName in appThemes)) {
    throw new Error(`Unknown screenshot theme "${themeName}". Available themes: ${Object.keys(appThemes).join(', ')}`)
  }

  const port = basePort + index
  const baseUrl = `http://127.0.0.1:${port}`

  await new Promise<void>((resolve, reject) => {
    const child = spawn('npm', ['run', 'screenshots'], {
      cwd: rootDir,
      env: {
        ...process.env,
        NUXT_UI_THEME: themeName,
        NUXT_IGNORE_LOCK: '1',
        SCREENSHOT_BASE_URL: baseUrl,
        SCREENSHOT_OUTPUT_DIR: `screenshots/themes/${themeName}`,
        BETTER_AUTH_URL: baseUrl
      },
      stdio: 'inherit'
    })

    child.on('exit', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Screenshot run failed for theme "${themeName}" with exit code ${code}`))
      }
    })
  })
}

for (const [index, themeName] of themeNames.entries()) {
  await runTheme(themeName, index)
}

console.log(`Captured screenshots for themes: ${themeNames.join(', ')}`)
