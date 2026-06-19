import type { LearnerSnapshot, SessionConfig } from '@/lib/api-client.js'

// Learner Snapshot layer — refresh per session. ~600 tokens budget.
// Compact view of who the student is and what they need right now.
export function buildLearnerSnapshot(
  config: SessionConfig,
  snapshot: LearnerSnapshot | null,
  insights: {
    topError: string
    topProgress: string
    openTopic: string | null
  }[],
): string {
  const profile = config.profile
  const profileLines: string[] = []

  if (profile) {
    if (profile.occupation)
      profileLines.push(`- Occupation: ${profile.occupation}`)
    if (profile.interests.length)
      profileLines.push(`- Interests: ${profile.interests.join(', ')}`)
    if (profile.hobbies.length)
      profileLines.push(`- Hobbies: ${profile.hobbies.join(', ')}`)
    if (profile.learningGoal)
      profileLines.push(`- Learning goal: ${profile.learningGoal}`)
    if (profile.ageGroup) profileLines.push(`- Age group: ${profile.ageGroup}`)
    if (profile.nativeLanguage)
      profileLines.push(`- Native language: ${profile.nativeLanguage}`)
  }

  const recentErrors = snapshot?.recentErrors.slice(0, 3) ?? []
  const dominated = snapshot?.dominatedStructures.slice(0, 5) ?? []
  const openTopics = snapshot?.openTopics.slice(0, 2) ?? []

  const sections: string[] = [`STUDENT LEVEL: ${config.level}`]

  if (profileLines.length) {
    sections.push(`STUDENT PROFILE:\n${profileLines.join('\n')}`)
  }

  if (recentErrors.length) {
    sections.push(
      `RECENT RECURRING ERRORS (gently address if relevant):\n${recentErrors
        .map((e) => `- ${e.pattern} (seen ${e.exampleCount}x)`)
        .join('\n')}`,
    )
  }

  if (dominated.length) {
    sections.push(
      `STRUCTURES THE STUDENT HAS MASTERED (do not over-correct):\n${dominated
        .map((s) => `- ${s.structure} (${s.accuracyPct}%)`)
        .join('\n')}`,
    )
  }

  if (openTopics.length) {
    sections.push(
      `OPEN TOPICS FROM PAST CONVERSATIONS (optional callbacks):\n${openTopics
        .map((t) => `- ${t.topic} (mentioned ${t.lastMentioned})`)
        .join('\n')}`,
    )
  }

  if (insights.length) {
    sections.push(
      `LAST SESSION SUMMARY:\n${insights
        .map(
          (i, idx) =>
            `[#${idx + 1}] top error: ${i.topError} | progress: ${i.topProgress}${
              i.openTopic ? ` | open: ${i.openTopic}` : ''
            }`,
        )
        .join('\n')}`,
    )
  }

  return sections.join('\n\n')
}
