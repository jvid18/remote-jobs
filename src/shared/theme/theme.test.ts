import { lightTheme } from '@/shared/theme/theme'

describe('theme contract', () => {
  it('lightTheme exposes all required color tokens', () => {
    const requiredTokens: (keyof typeof lightTheme.color)[] = [
      'background',
      'surface',
      'surfaceMuted',
      'border',
      'borderSubtle',
      'textPrimary',
      'textSecondary',
      'textMuted',
      'textFaint',
      'primary',
      'onPrimary',
      'favorite',
      'success',
      'successSurface',
      'danger',
      'dangerSurface',
      'info',
      'infoSurface',
    ]
    for (const token of requiredTokens) {
      expect(lightTheme.color[token]).toMatch(/^#[0-9A-Fa-f]{6}$/)
    }
  })
})
