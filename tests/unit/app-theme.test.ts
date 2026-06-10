import { describe, expect, it } from 'vitest'
import { appThemes, getAppTheme } from '../../app/themes'

const requiredColors = [
  'primary',
  'secondary',
  'success',
  'info',
  'warning',
  'error',
  'neutral'
]

describe('app themes', () => {
  it('registers named Nuxt UI themes', () => {
    expect(Object.keys(appThemes)).toEqual(expect.arrayContaining([
      'default',
      'ocean',
      'forest',
      'sunset',
      'mono'
    ]))
  })

  it('keeps every theme compatible with Nuxt UI semantic colors', () => {
    for (const theme of Object.values(appThemes)) {
      expect(Object.keys(theme.ui.colors)).toEqual(expect.arrayContaining(requiredColors))
    }
  })

  it('fails fast for unknown theme names', () => {
    expect(() => getAppTheme('missing')).toThrow('Unknown app theme')
  })
})
