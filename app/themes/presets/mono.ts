import { type AppTheme, defaultTheme } from './default'

export const monoTheme = {
  ui: {
    ...defaultTheme.ui,
    colors: {
      ...defaultTheme.ui.colors,
      primary: 'zinc',
      secondary: 'slate',
      success: 'emerald',
      info: 'sky',
      warning: 'amber',
      error: 'rose',
      neutral: 'neutral'
    }
  }
} satisfies AppTheme
