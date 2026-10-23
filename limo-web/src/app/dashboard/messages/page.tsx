'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import {
  MessageSquare,
  Send,
  Paperclip,
  CheckCheck,
  Search,
  User,
  ShieldCheck,
} from 'lucide-react';

function MessagesContent() {
  const searchParams = useSearchParams();
  const queryConvId = searchParams.get('conv');

  const { conversations, messages, sendMessage } = useData();
  const { user } = useAuth();

  const [activeConvId, setActiveConvId] = useState<string>(
    queryConvId || conversations[0]?.id || ''
  );
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (queryConvId) {
      setActiveConvId(queryConvId);
    }
  }, [queryConvId]);

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeConvId),
    [conversations, activeConvId]
  );

  const activeMessages = useMemo(
    () => messages.filter((m) => m.conversation_id === activeConvId),
    [messages, activeConvId]
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages.length]);

  const otherParticipantName = useMemo(() => {
    if (!activeConversation) return 'Member';
    const otherId = activeConversation.participant_ids.find((id) => id !== user?.id);
    return otherId ? activeConversation.participant_names[otherId] : 'Colleague';
  }, [activeConversation, user]);

  const otherParticipantAvatar = useMemo(() => {
    if (!activeConversation || !activeConversation.participant_avatars) return '';
    const otherId = activeConversation.participant_ids.find((id) => id !== user?.id);
    return otherId ? activeConversation.participant_avatars[otherId] : '';
  }, [activeConversation, user]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConvId) return;

    sendMessage(activeConvId, inputText.trim());
    setInputText('');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark shadow-xl overflow-hidden min-h-[75vh]">
        {/* Left Conversations Sidebar */}
        <div className="lg:col-span-4 border-r border-slate-200 dark:border-slate-800 flex flex-col">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="font-bold text-base text-limo-navy dark:text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-limo-blue" />
              <span>Project Messages</span>
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {conversations.map((conv) => {
              const isActive = conv.id === activeConvId;
              const otherId = conv.participant_ids.find((id) => id !== user?.id) || '';
              const name = conv.participant_names[otherId] || 'Member';
              const avatar = conv.participant_avatars?.[otherId] || '';

              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`w-full text-left p-4 flex items-start gap-3.5 transition ${
                    isActive
                      ? 'bg-blue-50/70 dark:bg-blue-950/40 border-l-4 border-limo-blue'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <img
                    src={avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={name}
                    className="w-11 h-11 rounded-full object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-limo-navy dark:text-white truncate">
                        {name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {conv.last_message_at ? new Date(conv.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {conv.project_title || 'Project Consultation'}
                    </p>

                    <p className="text-xs text-slate-600 dark:text-slate-400 truncate mt-1">
                      {conv.last_message}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Active Chat Pane */}
        <div className="lg:col-span-8 flex flex-col justify-between h-[75vh]">
          {activeConversation ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-limo-cardDark">
                <div className="flex items-center gap-3">
                  <img
                    src={otherParticipantAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={otherParticipantName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-limo-navy dark:text-white">
                      {otherParticipantName}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {activeConversation.project_title || 'Direct Consultation'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Encrypted Channel</span>
                </div>
              </div>

              {/* Message List */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/60 dark:bg-slate-900/40">
                {activeMessages.map((msg) => {
                  const isMine = msg.sender_id === user?.id || msg.sender_name === user?.full_name;

                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          isMine
                            ? 'bg-limo-blue text-white rounded-br-none shadow-md shadow-blue-500/10'
                            : 'bg-white dark:bg-limo-cardDark text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-bl-none shadow-sm'
                        }`}
                      >
                        <p>{msg.content}</p>
                        <div
                          className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                            isMine ? 'text-blue-100' : 'text-slate-400'
                          }`}
                        >
                          <span>
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isMine && <CheckCheck className="w-3 h-3" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Bar */}
              <form
                onSubmit={handleSend}
                className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-limo-cardDark flex items-center gap-3"
              >
                <input
                  type="text"
                  placeholder={`Reply to ${otherParticipantName}...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-limo-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-limo-blue"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-3 rounded-2xl bg-limo-blue hover:bg-limo-blueHover disabled:opacity-40 text-white transition shadow-sm"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 space-y-2">
              <MessageSquare className="w-12 h-12 stroke-1" />
              <p className="text-sm">Select a project conversation from the sidebar to chat.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Loading conversations...</div>}>
      <MessagesContent />
    </React.Suspense>
  );
}
