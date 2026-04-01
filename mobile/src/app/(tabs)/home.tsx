import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import {
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useSessionStore } from '../../features/auth/store/session-store'
import { ModulePath } from '../../features/home/components/module-path'
import { useHomeViewModel } from '../../features/home/viewmodels/use-home-view-model'
import { EmptyState } from '../../shared/components/empty-state'
import { LoadingState } from '../../shared/components/loading-state'
import { ScreenContainer } from '../../shared/components/screen-container'
import { SectionTitle } from '../../shared/components/section-title'
import { theme } from '../../shared/theme'

export default function HomeTab() {
  const { map, isLoading, openLesson, refetch } = useHomeViewModel()
  const user = useSessionStore((state) => state.user)
  const insets = useSafeAreaInsets()

  if (isLoading) {
    return (
      <ScreenContainer>
        <LoadingState />
      </ScreenContainer>
    )
  }

  if (!map) {
    return (
      <ScreenContainer>
        <View style={styles.content}>
          <SectionTitle title="Home" subtitle="Seu mapa nao foi carregado." />
          <EmptyState message="Sem dados de modulo por enquanto." />
        </View>
      </ScreenContainer>
    )
  }

  const currentLesson = map.modules
    .flatMap((module) => module.lessons)
    .find((lesson) => lesson.isCurrent)

  const userName = user?.name?.split(' ')[0] ?? 'Aluno'

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: Math.max(insets.top - 32, 8),
          },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => void refetch()} />
        }
      >
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={styles.avatarWrap}>
              {user?.avatarUrl ? (
                <Image
                  source={{ uri: user.avatarUrl }}
                  style={styles.avatarImage}
                />
              ) : (
                <Text style={styles.avatarText}>{userName.slice(0, 1)}</Text>
              )}
            </View>

            <View style={styles.heroTextWrap}>
              <Text style={styles.heroEyebrow}>Seu coach de conversacao</Text>
              <Text style={styles.heroTitle}>{userName}, vamos continuar?</Text>
              <Text style={styles.heroSubtitle}>
                Seu Lery preparou a proxima etapa para hoje.
              </Text>
            </View>
          </View>

          <Pressable
            style={styles.heroButton}
            onPress={() => currentLesson && openLesson(currentLesson.id)}
            disabled={!currentLesson}
          >
            <Ionicons name="play" size={14} color="#F4FFFC" />
            <Text style={styles.heroButtonText}>
              {currentLesson
                ? `Continuar: ${currentLesson.title}`
                : 'Sem lesson ativa'}
            </Text>
          </Pressable>

          <View style={styles.quickActionsRow}>
            <Pressable
              style={styles.quickActionButton}
              onPress={() => currentLesson && openLesson(currentLesson.id)}
              disabled={!currentLesson}
            >
              <Ionicons name="mic" size={16} color="#F4FFFC" />
              <Text style={styles.quickActionText}>Praticar agora</Text>
            </Pressable>

            <Pressable
              style={styles.quickActionGhost}
              onPress={() => router.push('/pair-lery')}
            >
              <Ionicons
                name="hardware-chip-outline"
                size={16}
                color="#D6F3E9"
              />
              <Text style={styles.quickActionGhostText}>Lery fisico</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.focusBar}>
          <Text style={styles.focusLabel}>Foco de hoje</Text>
          <Text style={styles.focusValue}>
            {currentLesson
              ? `${currentLesson.title} • ${map.level}`
              : `Nivel ${map.level}`}
          </Text>
        </View>

        <ModulePath map={map} onPressLesson={openLesson} />
      </ScrollView>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: 8,
    gap: 12,
    paddingBottom: 120,
  },
  heroCard: {
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#156B55',
    backgroundColor: '#1D8A70',
    padding: 14,
    gap: 12,
    shadowColor: '#1D8A70',
    shadowOpacity: 0.24,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  heroTop: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  avatarWrap: {
    width: 56,
    height: 56,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.28)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    color: '#F1FFFA',
    fontSize: 24,
    fontWeight: '800',
  },
  heroTextWrap: {
    flex: 1,
  },
  heroEyebrow: {
    color: '#CFF0E5',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: '#F5FFFB',
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
    marginTop: 2,
  },
  heroSubtitle: {
    color: '#D6F3E9',
    marginTop: 2,
    fontSize: 13,
  },
  heroButton: {
    minHeight: 44,
    borderRadius: 999,
    backgroundColor: 'rgba(0, 0, 0, 0.24)',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  heroButtonText: {
    color: '#F4FFFC',
    fontSize: 14,
    fontWeight: '700',
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quickActionButton: {
    flex: 1,
    minHeight: 42,
    borderRadius: 999,
    backgroundColor: 'rgba(0, 0, 0, 0.24)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  quickActionText: {
    color: '#F4FFFC',
    fontSize: 13,
    fontWeight: '700',
  },
  quickActionGhost: {
    flex: 1,
    minHeight: 42,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  quickActionGhostText: {
    color: '#D6F3E9',
    fontSize: 13,
    fontWeight: '700',
  },
  focusBar: {
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2ECE7',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 2,
  },
  focusLabel: {
    color: theme.colors.muted,
    fontSize: 11,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  focusValue: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
})
