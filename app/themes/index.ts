import { type AppTheme, defaultTheme } from './presets/default'
import { forestTheme } from './presets/forest'
import { monoTheme } from './presets/mono'
import { oceanTheme } from './presets/ocean'
import { sunsetTheme } from './presets/sunset'

export const appThemes = {
  default: defaultTheme,
  ocean: oceanTheme,
  forest: forestTheme,
  sunset: sunsetTheme,
  mono: monoTheme
} satisfies Record<string, AppTheme>

export type AppThemeName = keyof typeof appThemes

export const isAppThemeName = (value: string): value is AppThemeName => {
  return value in appThemes
}

export const getAppTheme = (name = 'default') => {
  if (!isAppThemeName(name)) {
    throw new Error(
      `Unknown app theme "${name}". Available themes: ${Object.keys(appThemes).join(', ')}`
    )
  }

  return appThemes[name]
}
