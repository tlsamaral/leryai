import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { ProfileMenuItem } from '../../features/profile/components/profile-menu-item'
import { StreakHighlight } from '../../features/profile/components/streak-highlight'
import { useProfileViewModel } from '../../features/profile/viewmodels/use-profile-view-model'
import { EmptyState } from '../../shared/components/empty-state'
import { LoadingState } from '../../shared/components/loading-state'
import { ScreenContainer } from '../../shared/components/screen-container'
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
          <EmptyState message="Perfil indisponivel no momento." />
        </View>
      </ScreenContainer>
    )
  }

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <Text style={styles.pageTitle}>Meu Perfil</Text>
          <Ionicons
            name="settings-outline"
            size={20}
            color={theme.colors.muted}
          />
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(user?.name ?? 'L').slice(0, 1)}
            </Text>
          </View>

          <View style={styles.infoWrap}>
            <Text style={styles.nameText}>{user?.name ?? 'Learner'}</Text>
            <Text style={styles.handleText}>
              @{(user?.email ?? 'lery').split('@')[0]}
            </Text>
          </View>

          <View style={styles.editButton}>
            <Text style={styles.editButtonText}>Editar Perfil</Text>
          </View>

          <StreakHighlight
            currentStreak={profile.streak.currentStreak}
            longestStreak={profile.streak.longestStreak}
          />
        </View>

        <View style={styles.menuCard}>
          <ProfileMenuItem
            icon="eye-outline"
            label="Preview tela inicial"
            onPress={() => router.push('/?preview=1')}
          />
          <ProfileMenuItem icon="heart-outline" label="Favoritos" />
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

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: 12,
    gap: theme.spacing.md,
    paddingBottom: 110,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pageTitle: {
    fontSize: 28,
    color: theme.colors.text,
    fontWeight: '800',
  },
  profileCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 26,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
    ...theme.shadow.soft,
  },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 999,
    backgroundColor: theme.colors.primarySoft,
    borderWidth: 3,
    borderColor: '#D1EEE3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: theme.colors.primary,
    fontSize: 34,
    fontWeight: '800',
  },
  infoWrap: {
    marginTop: 10,
    alignItems: 'center',
  },
  nameText: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  handleText: {
    color: theme.colors.muted,
    fontSize: 14,
    marginTop: 2,
  },
  editButton: {
    marginTop: 12,
    backgroundColor: theme.colors.primary,
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  editButtonText: {
    color: '#F6FFF9',
    fontWeight: '700',
    fontSize: 14,
  },
  menuCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 24,
    paddingHorizontal: 14,
    overflow: 'hidden',
  },
})
