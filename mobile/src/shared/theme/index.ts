import { colors } from '../tokens/colors'
import { radius, spacing } from '../tokens/spacing'
import { lineHeights, typography } from '../tokens/typography'

export const theme = {
  colors,
  spacing,
  radius,
  typography,
  lineHeights,
  shadow: {
    soft: {
      shadowColor: '#102A22',
      shadowOpacity: 0.06,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 5 },
      elevation: 4,
    },
  },
}

export type Theme = typeof theme
