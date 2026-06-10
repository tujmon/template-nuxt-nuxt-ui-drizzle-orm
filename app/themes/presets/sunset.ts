import { defaultTheme, type AppTheme } from './default'

export const sunsetTheme = {
  ui: {
    ...defaultTheme.ui,
    colors: {
      ...defaultTheme.ui.colors,
      primary: 'rose',
      secondary: 'amber',
      success: 'emerald',
      info: 'sky',
      warning: 'orange',
      error: 'red',
      neutral: 'zinc'
    }
  }
} satisfies AppTheme
