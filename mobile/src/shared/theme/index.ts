import { colors } from '../tokens/colors'
import { radius, spacing } from '../tokens/spacing'
import { fontWeights, lineHeights, tracking, typography } from '../tokens/typography'

export const theme = {
  colors,
  spacing,
  radius,
  typography,
  lineHeights,
  fontWeights,
  tracking,
  gradients: {
    hero:    ['#04D2FF', '#0091B8'] as [string, string],
    glow:    ['rgba(4,210,255,0)', 'rgba(4,210,255,0.22)'] as [string, string],
    surface: ['#FFFFFF', '#F2F7FA'] as [string, string],
    dark:    ['#040D12', '#0A1B23'] as [string, string],
  },
  motion: {
    fast:   150,
    normal: 250,
    slow:   400,
  },
  shadow: {
    cyan: {
      shadowColor: '#04D2FF',
      shadowOpacity: 0.28,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 8,
    },
    soft: {
      shadowColor: '#0A1B23',
      shadowOpacity: 0.06,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 5 },
      elevation: 4,
    },
  },
}

export type Theme = typeof theme
