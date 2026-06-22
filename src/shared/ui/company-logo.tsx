import { Image } from 'expo-image'
import { useState } from 'react'
import { Text, View } from 'react-native'

import { companyInitial } from '@/shared/lib/job-format'
import { getCategoryColor } from '@/shared/theme/category-colors'
import { makeStyles } from '@/shared/theme/make-styles'

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
  const [imgError, setImgError] = useState(false)
  const dims = { width: size, height: size, borderRadius: size * 0.3 }
  const { bg, fg } = getCategoryColor(category)

  if (uri && !imgError) {
    return (
      <View style={[styles.imageContainer, dims]} importantForAccessibility="no">
        <Image
          source={{ uri }}
          style={styles.image}
          contentFit="contain"
          accessibilityIgnoresInvertColors
          importantForAccessibility="no"
          onError={() => setImgError(true)}
        />
      </View>
    )
  }

  return (
    <View style={[styles.fallback, dims, { backgroundColor: bg }]} importantForAccessibility="no">
      <Text style={[styles.initial, { color: fg, fontSize: size * 0.42 }]}>
        {companyInitial(companyName)}
      </Text>
    </View>
  )
}

const useStyles = makeStyles(t => ({
  imageContainer: {
    backgroundColor: t.color.surface,
    overflow: 'hidden',
    padding: 4,
  },
  image: { flex: 1, width: '100%', height: '100%' },
  fallback: { alignItems: 'center', justifyContent: 'center' },
  initial: { fontWeight: t.font.weight.extrabold },
}))
