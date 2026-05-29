import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/constants/api';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function OrderChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    initChat();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  const initChat = async () => {
    try {
      const userJson = await AsyncStorage.getItem('user');
      if (userJson) {
        setUser(JSON.parse(userJson));
      }
      await fetchMessages();
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const response = await axios.get(`${API_URL}/user/orders/${id}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.data) {
        setMessages(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      const token = await AsyncStorage.getItem('auth_token');
      const msg = newMessage;
      setNewMessage('');
      
      await axios.post(`${API_URL}/user/orders/${id}/messages`, 
        { message: msg },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      await fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <IconSymbol name="chevron.left" size={24} color="#64748B" />
          </TouchableOpacity>
          <View style={styles.agentInfo}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>A</Text>
              </View>
              <View style={styles.onlineDot} />
            </View>
            <View>
              <Text style={styles.agentName}>Support Agent</Text>
              <Text style={styles.onlineStatus}>Online</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity>
          <IconSymbol name="list.bullet" size={24} color="#64748B" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.flex1}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#7C3AED" style={styles.loader} />
          ) : (
            <>
              <View style={styles.dateSeparator}>
                <View style={styles.dateBadge}>
                  <Text style={styles.dateText}>Today</Text>
                </View>
              </View>

              {messages.map((msg) => {
                const isMe = msg.sender_id === user?.id;
                return (
                  <View 
                    key={msg.id} 
                    style={[
                      styles.messageWrapper, 
                      isMe ? styles.myMessageWrapper : styles.agentMessageWrapper
                    ]}
                  >
                    <View 
                      style={[
                        styles.messageBubble,
                        isMe ? styles.myBubble : styles.agentBubble
                      ]}
                    >
                      <Text style={[styles.messageText, isMe && styles.myMessageText]}>
                        {msg.message}
                      </Text>
                      <Text style={[styles.messageTime, isMe ? styles.myTime : styles.agentTime]}>
                        {formatTime(msg.created_at)}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </>
          )}
        </ScrollView>

        {/* Input Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.attachBtn}>
            <IconSymbol name="paperclip" size={24} color="#64748B" />
          </TouchableOpacity>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              placeholderTextColor="#94A3B8"
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
            />
          </View>
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
            <IconSymbol name="arrow.up" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  flex1: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    padding: 4,
  },
  agentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#7C3AED',
    fontWeight: 'bold',
    fontSize: 16,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  agentName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  onlineStatus: {
    fontSize: 10,
    fontWeight: '700',
    color: '#22C55E',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  messagesContent: {
    padding: 16,
    gap: 16,
  },
  loader: {
    marginTop: 20,
  },
  dateSeparator: {
    alignItems: 'center',
    marginVertical: 8,
  },
  dateBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dateText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  messageWrapper: {
    flexDirection: 'row',
    width: '100%',
  },
  agentMessageWrapper: {
    justifyContent: 'flex-start',
  },
  myMessageWrapper: {
    justifyContent: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  agentBubble: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderBottomLeftRadius: 0,
  },
  myBubble: {
    backgroundColor: '#7C3AED',
    borderBottomRightRadius: 0,
    shadowColor: '#7C3AED',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },
  messageText: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
  },
  myMessageText: {
    color: '#FFF',
  },
  messageTime: {
    fontSize: 9,
    marginTop: 8,
    textAlign: 'right',
  },
  agentTime: {
    color: '#94A3B8',
  },
  myTime: {
    color: '#DDD6FE',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 12,
  },
  attachBtn: {
    padding: 4,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
  },
  input: {
    fontSize: 14,
    color: '#1E293B',
    padding: 0,
  },
  sendBtn: {
    width: 44,
    height: 44,
    backgroundColor: '#7C3AED',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
});
