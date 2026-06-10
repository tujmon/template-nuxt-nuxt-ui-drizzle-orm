import { defaultTheme, type AppTheme } from './default'

export const forestTheme = {
  ui: {
    ...defaultTheme.ui,
    colors: {
      ...defaultTheme.ui.colors,
      primary: 'lime',
      secondary: 'emerald',
      success: 'green',
      info: 'cyan',
      warning: 'amber',
      error: 'rose',
      neutral: 'stone'
    }
  }
} satisfies AppTheme
