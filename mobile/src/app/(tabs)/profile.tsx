import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { ProfileMenuItem } from '../../features/profile/components/profile-menu-item'
import { useProfileViewModel } from '../../features/profile/viewmodels/use-profile-view-model'
import { EmptyState } from '../../shared/components/empty-state'
import { LoadingState } from '../../shared/components/loading-state'
import { ScreenContainer } from '../../shared/components/screen-container'
import { StatCard } from '../../shared/components/stat-card'
import { theme } from '../../shared/theme'

export default function ProfileTab() {
  const { profile, isLoading, logout, user } = useProfileViewModel()

  if (isLoading) {
    return (
      <ScreenContainer>
        <LoadingState />
      </ScreenContainer>
    )
  }

  if (!profile) {
    return (
      <ScreenContainer>
        <View style={styles.content}>
          <Text style={styles.pageTitle}>Meu Perfil</Text>
          <EmptyState message="Perfil indisponível no momento." />
        </View>
      </ScreenContainer>
    )
  }

  const initial = (user?.name ?? 'L').slice(0, 1).toUpperCase()
  const handle = (user?.email ?? 'lery').split('@')[0]
  const interests = profile.profile?.interests ?? []
  const occupation = profile.profile?.occupation

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <Text style={styles.pageTitle}>Perfil</Text>
          <Ionicons
            name="settings-outline"
            size={20}
            color={theme.colors.muted}
          />
        </View>

        {/* Dark hero with glow */}
        <View style={styles.heroCard}>
          <View style={styles.heroGlow} />
          <View style={styles.heroGlow2} />

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>

          <Text style={styles.heroName}>{user?.name ?? 'Aluno'}</Text>
          <Text style={styles.heroHandle}>@{handle}</Text>

          {occupation ? (
            <View style={styles.occupationChip}>
              <Ionicons name="briefcase-outline" size={11} color="#04D2FF" />
              <Text style={styles.occupationText}>{occupation}</Text>
            </View>
          ) : null}

          {interests.length > 0 ? (
            <View style={styles.interestsRow}>
              {interests.slice(0, 4).map((tag) => (
                <View key={tag} style={styles.interestChip}>
                  <Text style={styles.interestText}>{tag}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>

        {/* Stats bento */}
        <View style={styles.statsRow}>
          <StatCard
            icon="flame"
            label="Sequência"
            value={`${profile.streak.currentStreak}`}
            hint="dias seguidos"
            tone="amber"
          />
          <StatCard
            icon="ribbon-outline"
            label="Recorde"
            value={`${profile.streak.longestStreak}`}
            hint="dias máx."
            tone="cyan"
          />
        </View>

        {/* Refazer onboarding card */}
        <ProfileBigButton
          icon="sparkles-outline"
          label="Atualizar perfil de IA"
          hint="Refaça o onboarding com a Lery"
          onPress={() => router.push('/onboarding')}
        />

        <View style={styles.menuCard}>
          <ProfileMenuItem
            icon="hardware-chip-outline"
            label="Pareamento Lery"
            onPress={() => router.push('/pair-lery')}
          />
          <ProfileMenuItem icon="language-outline" label="Idioma" />
          <ProfileMenuItem icon="card-outline" label="Assinatura" />
          <ProfileMenuItem
            icon="log-out-outline"
            label="Sair da conta"
            tone="danger"
            onPress={logout}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  )
}

function ProfileBigButton({
  icon,
  label,
  hint,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name']
  label: string
  hint: string
  onPress: () => void
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.bigBtnWrap, pressed && { opacity: 0.85 }]}
    >
      <View style={styles.bigBtnIcon}>
        <Ionicons name={icon} size={18} color={theme.colors.primary} />
      </View>
      <View style={styles.bigBtnTexts}>
        <Text style={styles.bigBtnLabel}>{label}</Text>
        <Text style={styles.bigBtnHint}>{hint}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={theme.colors.primaryDeep} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: 12,
    gap: 16,
    paddingBottom: 130,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pageTitle: {
    fontSize: 26,
    color: theme.colors.text,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  heroCard: {
    backgroundColor: '#040D12',
    borderRadius: 28,
    paddingVertical: 24,
    paddingHorizontal: 18,
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(4,210,255,0.18)',
    gap: 6,
    shadowColor: '#04D2FF',
    shadowOpacity: 0.20,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  heroGlow: {
    position: 'absolute',
    top: -100,
    right: -50,
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: 'rgba(4,210,255,0.18)',
  },
  heroGlow2: {
    position: 'absolute',
    bottom: -80,
    left: -50,
    width: 180,
    height: 180,
    borderRadius: 999,
    backgroundColor: 'rgba(4,210,255,0.10)',
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 999,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(4,210,255,0.40)',
    shadowColor: '#04D2FF',
    shadowOpacity: 0.6,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
  },
  avatarText: {
    color: '#040D12',
    fontSize: 36,
    fontWeight: '900',
  },
  heroName: {
    color: '#F6FAFE',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginTop: 6,
  },
  heroHandle: {
    color: 'rgba(229,250,255,0.6)',
    fontSize: 13,
    fontWeight: '600',
  },
  occupationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(4,210,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(4,210,255,0.30)',
    marginTop: 8,
  },
  occupationText: {
    color: '#04D2FF',
    fontSize: 11,
    fontWeight: '700',
  },
  interestsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10,
  },
  interestChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(229,250,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(229,250,255,0.10)',
  },
  interestText: {
    color: 'rgba(229,250,255,0.85)',
    fontSize: 11,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  bigBtnWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: theme.colors.primarySoft,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: `${theme.colors.primary}33`,
  },
  bigBtnIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigBtnTexts: {
    flex: 1,
    gap: 2,
  },
  bigBtnLabel: {
    color: theme.colors.primaryDeep,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  bigBtnHint: {
    color: theme.colors.primaryDeep,
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.7,
  },
  menuCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 22,
    paddingHorizontal: 14,
    overflow: 'hidden',
    ...theme.shadow.soft,
  },
})
