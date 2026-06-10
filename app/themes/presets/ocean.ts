import { defaultTheme, type AppTheme } from './default'

export const oceanTheme = {
  ui: {
    ...defaultTheme.ui,
    colors: {
      ...defaultTheme.ui.colors,
      primary: 'cyan',
      secondary: 'blue',
      success: 'teal',
      info: 'sky',
      neutral: 'zinc'
    }
  }
} satisfies AppTheme
