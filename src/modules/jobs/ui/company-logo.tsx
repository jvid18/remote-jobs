import { Image, Text, View } from 'react-native'

import { getCategoryColor } from '@/shared/theme/category-colors'
import { makeStyles } from '@/shared/theme/make-styles'

import { companyInitial } from './job-presentation'

type CompanyLogoProps = {
  uri: string | null
  companyName: string
  category: string
  size?: number
}

// Logo image when available, otherwise a colored initial avatar tinted by category.
// Decorative either way — hidden from assistive tech (the card label names the job).
export function CompanyLogo({ uri, companyName, category, size = 50 }: CompanyLogoProps) {
  const styles = useStyles()
  const dims = { width: size, height: size, borderRadius: size * 0.3 }

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[styles.image, dims]}
        accessibilityIgnoresInvertColors
        importantForAccessibility="no"
      />
    )
  }

  const { bg, fg } = getCategoryColor(category)
  return (
    <View style={[styles.fallback, dims, { backgroundColor: bg }]} importantForAccessibility="no">
      <Text style={[styles.initial, { color: fg, fontSize: size * 0.42 }]}>
        {companyInitial(companyName)}
      </Text>
    </View>
  )
}

const useStyles = makeStyles(t => ({
  image: { backgroundColor: t.color.surfaceMuted },
  fallback: { alignItems: 'center', justifyContent: 'center' },
  initial: { fontWeight: t.font.weight.extrabold },
}))
