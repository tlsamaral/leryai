import { StatusBar } from 'expo-status-bar'
import type { PropsWithChildren, ReactNode } from 'react'
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface DarkHeroLayoutProps extends PropsWithChildren {
  /** Content rendered inside the dark hero section (below safe-area) */
  hero: ReactNode
  /** Called on pull-to-refresh; omit to disable */
  onRefresh?: () => void
  /** Whether refresh is in progress */
  refreshing?: boolean
  /** Extra bottom padding added inside the white card (default 130 for tab-bar) */
  bottomPadding?: number
  /** Pass an Animated.ScrollView's animated value if you need scroll tracking */
  scrollRef?: React.RefObject<ScrollView>
}

const SCREEN_HEIGHT = Dimensions.get('window').height

/**
 * DarkHeroLayout
 *
 * Encapsulates the dark-header → white-card pattern used across every screen:
 *
 *  ┌─────────────────────────┐
 *  │  DARK  (#040D12)        │ ← safe-area top + hero slot
 *  │  [hero content]         │
 *  │  heroBottomSpacer (28)  │
 *  ├──────────────────────── ┤
 *  │  WHITE CARD             │ ← borderTopRadius 28, marginTop -16
 *  │  [children]             │
 *  └─────────────────────────┘
 *
 * - StatusBar is set to "light" (white icons on dark bg)
 * - Safe-area inset is consumed here so hero children don't need it
 * - White card has minHeight = screen height so dark bg never shows below
 */
export function DarkHeroLayout({
  hero,
  children,
  onRefresh,
  refreshing = false,
  bottomPadding = 130,
  scrollRef,
}: DarkHeroLayoutProps) {
  const insets = useSafeAreaInsets()

  return (
    <>
      {/* Light icons on the dark status bar */}
      <StatusBar style="light" />

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#FFFFFF"
              progressBackgroundColor="#040D12"
            />
          ) : undefined
        }
      >
        {/* ── Dark hero section ── */}
        <View style={[styles.darkHero, { paddingTop: insets.top + 8 }]}>
          <View style={styles.glowTopRight} />
          <View style={styles.glowBottomLeft} />
          {hero}
          <View style={styles.heroBottomSpacer} />
        </View>

        {/* ── White content card ── */}
        <View style={[styles.whiteCard, { paddingBottom: bottomPadding + insets.bottom }]}>
          {children}
        </View>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#040D12',
  },
  content: {
    flexGrow: 1,
  },
  darkHero: {
    backgroundColor: '#040D12',
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  glowTopRight: {
    position: 'absolute',
    top: -60,
    right: -40,
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: 'rgba(4,210,255,0.10)',
  },
  glowBottomLeft: {
    position: 'absolute',
    bottom: 20,
    left: -50,
    width: 160,
    height: 160,
    borderRadius: 999,
    backgroundColor: 'rgba(4,210,255,0.05)',
  },
  heroBottomSpacer: {
    height: 28,
  },
  whiteCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -16,
    paddingTop: 24,
    paddingHorizontal: 16,
    gap: 16,
    minHeight: SCREEN_HEIGHT,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    elevation: 4,
  },
})
