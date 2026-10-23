// ==============================================================================
// LIMO MESSAGING — PROJECT-LINKED CONVERSATIONS
// Real-time project communication threads, read indicators, unread counts
// ==============================================================================

import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

export default function MessagesListScreen() {
  const { conversations, messages } = useData();
  const { user, role } = useAuth();
  const { colors, isDark } = useTheme();
  const router = useRouter();

  // Filter conversations where user is a participant (or all if admin)
  const userConversations = useMemo(() => {
    return conversations.filter(
      (c) => role === 'admin' || c.participant_ids.includes(user?.id || '')
    );
  }, [conversations, user, role]);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background },
      ]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Project Conversations</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Secure, project-gated messaging between verified clients and specialists.
        </Text>
      </View>

      {userConversations.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Ionicons name="chatbubbles-outline" size={48} color={colors.textMuted} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No Active Conversations
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Conversations are automatically created when proposals are reviewed or when you message talent.
          </Text>
        </Card>
      ) : (
        userConversations.map((conv) => {
          // Identify other participant
          const otherUserId =
            conv.participant_ids.find((id) => id !== user?.id) ||
            conv.participant_ids[0];
          const otherName =
            conv.participant_names[otherUserId] || 'Project Participant';
          const otherAvatar = conv.participant_avatars?.[otherUserId];

          return (
            <TouchableOpacity
              key={conv.id}
              activeOpacity={0.8}
              onPress={() => router.push(`/chat/${conv.id}`)}
              style={[
                styles.conversationCard,
                {
                  backgroundColor: colors.card,
                  borderColor: conv.unread_count > 0 ? BrandColors.electricBlue : colors.border,
                },
              ]}>
              <Avatar url={otherAvatar} name={otherName} size="lg" showOnlineStatus />

              <View style={styles.contentCol}>
                <View style={styles.nameRow}>
                  <Text style={[styles.participantName, { color: colors.text }]}>
                    {otherName}
                  </Text>
                  {conv.last_message_at && (
                    <Text style={[styles.timeText, { color: colors.textMuted }]}>
                      {new Date(conv.last_message_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  )}
                </View>

                {/* Project context tag */}
                {conv.project_title && (
                  <View
                    style={[
                      styles.projectTag,
                      {
                        backgroundColor: isDark ? 'rgba(0, 82, 255, 0.12)' : '#EFF6FF',
                      },
                    ]}>
                    <Text
                      style={[styles.projectTagText, { color: BrandColors.electricBlue }]}
                      numberOfLines={1}>
                      Context: {conv.project_title}
                    </Text>
                  </View>
                )}

                <View style={styles.lastMessageRow}>
                  <Text
                    style={[
                      styles.lastMessage,
                      {
                        color:
                          conv.unread_count > 0 ? colors.text : colors.textSecondary,
                        fontWeight: conv.unread_count > 0 ? '700' : '400',
                      },
                    ]}
                    numberOfLines={1}>
                    {conv.last_message || 'Start the conversation...'}
                  </Text>

                  {conv.unread_count > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}>{conv.unread_count}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.base,
    paddingBottom: Spacing.xxxl,
  },
  header: {
    marginBottom: Spacing.base,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
    lineHeight: 18,
  },
  conversationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  contentCol: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  participantName: {
    fontSize: 15,
    fontWeight: '700',
  },
  timeText: {
    fontSize: 11,
  },
  projectTag: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: Radius.xs,
    alignSelf: 'flex-start',
    marginVertical: 4,
  },
  projectTagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  lastMessageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  lastMessage: {
    fontSize: 13,
    flex: 1,
    marginRight: Spacing.sm,
  },
  unreadBadge: {
    backgroundColor: BrandColors.electricBlue,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.base,
    marginTop: Spacing.xl,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: Spacing.md,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
});
