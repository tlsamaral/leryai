import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { Image, StyleSheet, Text, View } from 'react-native'
import { ProfileMenuItem } from '../../features/profile/components/profile-menu-item'
import { useProfileViewModel } from '../../features/profile/viewmodels/use-profile-view-model'
import { AppCard } from '../../shared/components/app-card'
import { CandyBadge } from '../../shared/components/candy-badge'
import { DarkHeroLayout } from '../../shared/components/dark-hero-layout'
import { EmptyState } from '../../shared/components/empty-state'
import { LoadingState } from '../../shared/components/loading-state'
import { PrimaryButton } from '../../shared/components/primary-button'
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
        <EmptyState message="Perfil indisponível no momento." />
      </ScreenContainer>
    )
  }

  const handle = (user?.email ?? 'lery').split('@')[0]
  const interests = profile.profile?.interests ?? []
  const occupation = profile.profile?.occupation ?? 'Software Engineer'

  return (
    <DarkHeroLayout
      hero={
        <View style={styles.topBar}>
          <Text style={styles.pageTitle}>Perfil</Text>
          <Ionicons
            name="settings-outline"
            size={24}
            color="rgba(229,250,255,0.5)"
          />
        </View>
      }
    >
      <AppCard tone="default" padding={20} radius={24}>
        <View style={styles.identityCardInner}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Image
                source={{ uri: 'https://github.com/tlsamaral.png' }}
                style={styles.avatarImage}
              />
            </View>
            <View style={styles.avatarEditBadge}>
              <Ionicons name="pencil" size={12} color="#FFFFFF" />
            </View>
          </View>

          <Text style={styles.heroNameLight}>{user?.name ?? 'Aluno'}</Text>
          <Text style={styles.heroHandleLight}>@{handle}</Text>

          <View style={styles.badgesRow}>
            <CandyBadge
              tone="cyan"
              icon="briefcase"
              label={occupation}
              size="small"
            />
          </View>

          {interests.length > 0 ? (
            <View style={styles.badgesRow}>
              {interests.slice(0, 4).map((tag) => (
                <CandyBadge key={tag} tone="default" label={tag} size="small" />
              ))}
            </View>
          ) : null}
        </View>
      </AppCard>

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

      <AppCard tone="default" padding={16} radius={22}>
        <View style={styles.bigBtnWrap}>
          <View style={styles.bigBtnIcon}>
            <Ionicons
              name="sparkles"
              size={20}
              color={theme.colors.primaryDeep}
            />
          </View>
          <View style={styles.bigBtnTexts}>
            <Text style={styles.bigBtnLabel}>Perfil de IA</Text>
            <Text style={styles.bigBtnHint}>
              Refaça o onboarding com a Lery
            </Text>
          </View>
        </View>
        <View style={{ marginTop: 12 }}>
          <PrimaryButton
            label="Atualizar perfil"
            tone="ghost"
            icon="chevron-forward"
            iconSide="right"
            onPress={() => router.push('/onboarding')}
          />
        </View>
      </AppCard>

      <AppCard tone="default" padding={14} radius={22}>
        <ProfileMenuItem
          icon="hardware-chip-outline"
          label="Pareamento Lery"
          onPress={() => router.push('/pair-lery')}
        />
        <ProfileMenuItem
          icon="volume-high-outline"
          label="Preferências de Áudio"
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
      </AppCard>
    </DarkHeroLayout>
  )
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 32,
  },
  pageTitle: {
    fontSize: 28,
    color: '#F6FAFE',
    fontFamily: theme.fonts.black,
    letterSpacing: -0.6,
  },
  identityCardInner: {
    alignItems: 'center',
  },
  avatarWrap: {
    position: 'relative',
    marginTop: -52,
    marginBottom: 12,
    zIndex: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },
  heroNameLight: {
    color: theme.colors.text,
    fontFamily: theme.fonts.extraBold,
    fontSize: 24,
    letterSpacing: -0.5,
  },
  heroHandleLight: {
    color: theme.colors.muted,
    fontSize: 15,
    fontWeight: '600',
    marginTop: 2,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
  },
  statsRow: { flexDirection: 'row', gap: 10 },

  bigBtnWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bigBtnIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigBtnTexts: { flex: 1, gap: 2 },
  bigBtnLabel: {
    color: theme.colors.primaryDeep,
    fontFamily: theme.fonts.extraBold,
    fontSize: 16,
    letterSpacing: -0.3,
  },
  bigBtnHint: {
    color: theme.colors.primaryDeep,
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.75,
  },
})
