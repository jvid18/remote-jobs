export type ThemeColors = {
  background: string
  surface: string
  surfaceMuted: string
  border: string
  borderSubtle: string
  textPrimary: string
  textSecondary: string
  textMuted: string
  textFaint: string
  primary: string
  onPrimary: string
  favorite: string
  success: string
  successSurface: string
  danger: string
  dangerSurface: string
  info: string
  infoSurface: string
}

export type Theme = {
  scheme: 'light' // for potential dark theme - not implemented yet
  color: ThemeColors
  radius: { sm: number; md: number; lg: number; xl: number; xxl: number }
  spacing: { xs: number; sm: number; md: number; lg: number; xl: number }
  font: {
    size: {
      caption: number
      footnote: number
      body: number
      bodyLg: number
      subtitle: number
      h3: number
      h2: number
      h1: number
    }
    weight: {
      regular: '400'
      medium: '500'
      semibold: '600'
      bold: '700'
      extrabold: '800'
    }
  }
}

const radius = { sm: 9, md: 13, lg: 16, xl: 20, xxl: 24 } as const
const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 } as const
const font = {
  size: {
    caption: 12,
    footnote: 13,
    body: 14,
    bodyLg: 16,
    subtitle: 17,
    h3: 21,
    h2: 24,
    h1: 27,
  },
  weight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
} as const

export const lightTheme = {
  scheme: 'light',
  color: {
    background: '#F4F5F7',
    surface: '#FFFFFF',
    surfaceMuted: '#F4F5F7',
    border: '#E4E5EC',
    borderSubtle: '#EAEBEF',
    textPrimary: '#16172A',
    textSecondary: '#5B5D6E',
    textMuted: '#9A9CAC',
    textFaint: '#B0B2BF',
    primary: '#16172A',
    onPrimary: '#FFFFFF',
    favorite: '#FF5D8F',
    success: '#2E8B5E',
    successSurface: '#E0F0E6',
    danger: '#D24A5E',
    dangerSurface: '#FBE2E6',
    info: '#3E63C7',
    infoSurface: '#E7EEFB',
  },
  radius,
  spacing,
  font,
} as const satisfies Theme
