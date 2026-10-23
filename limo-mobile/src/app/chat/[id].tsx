// ==============================================================================
// LIMO REAL-TIME MESSAGING — PROJECT CHAT ROOM
// Section 8 & 13: Project-specific messaging, read indicators, reactive updates
// ==============================================================================

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Avatar } from '@/components/ui/Avatar';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

export default function ChatRoomScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { colors, isDark } = useTheme();
  const { conversations, messages, sendMessage } = useData();

  const [inputContent, setInputContent] = useState('');
  const scrollViewRef = useRef<any>(null);

  const conversation = useMemo(
    () => conversations.find((c) => c.id === id),
    [conversations, id]
  );

  const conversationMessages = useMemo(
    () => messages.filter((m) => m.conversation_id === id),
    [messages, id]
  );

  // Auto-scroll to bottom on new message
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [conversationMessages.length]);

  const otherParticipantId = useMemo(() => {
    if (!conversation) return '';
    return (
      conversation.participant_ids.find((pid) => pid !== user?.id) ||
      conversation.participant_ids[0]
    );
  }, [conversation, user]);

  const otherParticipantName =
    conversation?.participant_names[otherParticipantId] || 'Member';
  const otherParticipantAvatar =
    conversation?.participant_avatars?.[otherParticipantId];

  const handleSend = async () => {
    if (!inputContent.trim() || !id) return;
    const toSend = inputContent.trim();
    setInputContent('');
    await sendMessage(id, toSend);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Bar */}
      <View
        style={[
          styles.headerBar,
          { backgroundColor: colors.card, borderBottomColor: colors.border },
        ]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { borderColor: colors.border }]}>
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>

        <Avatar
          url={otherParticipantAvatar}
          name={otherParticipantName}
          size="sm"
          showOnlineStatus
        />

        <View style={styles.headerInfo}>
          <Text style={[styles.headerName, { color: colors.text }]}>
            {otherParticipantName}
          </Text>
          {conversation?.project_title ? (
            <Text
              style={[styles.headerProject, { color: BrandColors.electricBlue }]}
              numberOfLines={1}>
              Project: {conversation.project_title}
            </Text>
          ) : (
            <Text style={[styles.headerStatus, { color: BrandColors.emerald }]}>
              Online
            </Text>
          )}
        </View>
      </View>

      {/* Messages Scroll Area */}
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}>
        {/* Security context notice */}
        <View style={styles.securityNotice}>
          <Ionicons name="lock-closed" size={12} color={colors.textMuted} />
          <Text style={[styles.securityNoticeText, { color: colors.textMuted }]}>
            End-to-end authorized project conversation. Monitored for platform integrity.
          </Text>
        </View>

        {conversationMessages.map((msg) => {
          const isMe = msg.sender_id === user?.id;

          return (
            <View
              key={msg.id}
              style={[
                styles.messageRow,
                isMe ? styles.messageRowMe : styles.messageRowOther,
              ]}>
              {!isMe && (
                <Avatar url={msg.sender_avatar} name={msg.sender_name} size="sm" />
              )}

              <View
                style={[
                  styles.bubble,
                  isMe
                    ? [styles.bubbleMe, { backgroundColor: BrandColors.electricBlue }]
                    : [
                        styles.bubbleOther,
                        {
                          backgroundColor: isDark
                            ? colors.backgroundSubtle
                            : colors.backgroundElement,
                          borderColor: colors.border,
                        },
                      ],
                ]}>
                <Text
                  style={[
                    styles.messageText,
                    { color: isMe ? '#FFFFFF' : colors.text },
                  ]}>
                  {msg.content}
                </Text>

                <View style={styles.metaRow}>
                  <Text
                    style={[
                      styles.timestampText,
                      { color: isMe ? 'rgba(255,255,255,0.7)' : colors.textMuted },
                    ]}>
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                  {isMe && (
                    <Ionicons
                      name={msg.is_read ? 'checkmark-done' : 'checkmark'}
                      size={14}
                      color={isMe ? '#FFFFFF' : colors.textMuted}
                      style={{ marginLeft: 4 }}
                    />
                  )}
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Input Bar */}
      <View
        style={[
          styles.inputBar,
          { backgroundColor: colors.card, borderTopColor: colors.border },
        ]}>
        <TextInput
          value={inputContent}
          onChangeText={setInputContent}
          placeholder="Type a message or discuss milestone deliverables..."
          placeholderTextColor={colors.textMuted}
          multiline
          style={[
            styles.textInput,
            {
              backgroundColor: isDark ? colors.backgroundSubtle : '#F1F5F9',
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
        />

        <TouchableOpacity
          disabled={!inputContent.trim()}
          onPress={handleSend}
          style={[
            styles.sendButton,
            {
              backgroundColor: inputContent.trim()
                ? BrandColors.electricBlue
                : colors.border,
            },
          ]}>
          <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  headerInfo: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  headerName: {
    fontSize: 15,
    fontWeight: '700',
  },
  headerProject: {
    fontSize: 11,
    fontWeight: '600',
  },
  headerStatus: {
    fontSize: 11,
    fontWeight: '600',
  },
  messagesList: {
    padding: Spacing.base,
    paddingBottom: Spacing.xxl,
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginVertical: Spacing.sm,
  },
  securityNoticeText: {
    fontSize: 11,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: Spacing.sm,
    gap: Spacing.xs,
  },
  messageRowMe: {
    justifyContent: 'flex-end',
  },
  messageRowOther: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: Radius.lg,
    padding: Spacing.sm + 2,
  },
  bubbleMe: {
    borderBottomRightRadius: Radius.xs,
  },
  bubbleOther: {
    borderBottomLeftRadius: Radius.xs,
    borderWidth: 1,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 3,
  },
  timestampText: {
    fontSize: 10,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: Spacing.sm,
    borderTopWidth: 1,
    gap: Spacing.sm,
  },
  textInput: {
    flex: 1,
    borderRadius: Radius.lg,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingTop: 10,
    paddingBottom: 10,
    maxHeight: 100,
    fontSize: 14,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
