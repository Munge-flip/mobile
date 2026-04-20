<template>
  <div class="chat-container">
    <div class="chat-box">
      <!-- MESSAGES AREA -->
      <div class="chat-messages" id="chatMessages" ref="messageContainer">
        <div v-for="msg in messages" :key="msg.id" 
             class="message-wrapper"
             :class="[msg.user_id === currentUserId ? 'sent' : 'received']"
        >
          <div class="message-bubble" :style="getMessageStyle(msg.user_id)">
            <p style="margin: 0;">{{ msg.message }}</p>
            <span class="message-data" :style="{ color: msg.user_id === currentUserId ? 'rgba(255,255,255,0.8)' : '#888' }">
              {{ msg.created_at_human }}
            </span>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="messages.length === 0 && !loading" class="chat-empty">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <p>No messages yet</p>
          <span>Start the conversation!</span>
        </div>

        <div v-if="loading" class="text-center p-4">
          <p>Loading chat...</p>
        </div>
      </div>

      <!-- INPUT AREA -->
      <div class="chat-input-container">
        <form @submit.prevent="sendMessage" class="chat-form">
          <input 
            type="text" 
            v-model="newMessage" 
            placeholder="Type a message..." 
            class="chat-input" 
            :disabled="sending"
            required 
            autocomplete="off"
          >
          <button type="submit" class="send-btn" :disabled="sending || !newMessage.trim()">
            <svg v-if="!sending" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
            <span v-else>...</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import axios from 'axios';

const props = defineProps({
  orderId: { type: [Number, String], required: true },
  currentUserId: { type: Number, required: true },
  apiUrl: { type: String, required: true }
});

const messages = ref([]);
const newMessage = ref('');
const loading = ref(true);
const sending = ref(false);
const messageContainer = ref(null);
let pollInterval = null;

async function fetchMessages() {
  try {
    const response = await axios.get(`${props.apiUrl}/messages`);
    if (response.data.success) {
      const oldLength = messages.value.length;
      messages.value = response.data.messages;
      
      // Only scroll to bottom if new messages arrived
      if (messages.value.length > oldLength) {
        await nextTick();
        scrollToBottom();
      }
    }
  } catch (error) {
    console.error('Failed to fetch messages:', error);
  } finally {
    loading.value = false;
  }
}

async function sendMessage() {
  if (!newMessage.value.trim() || sending.value) return;
  
  sending.value = true;
  const text = newMessage.value;
  newMessage.value = ''; // Clear immediately for better UX

  try {
    const response = await axios.post(`${props.apiUrl}/messages`, {
      message: text
    });
    
    if (response.data.success) {
      messages.value.push(response.data.message);
      await nextTick();
      scrollToBottom();
    }
  } catch (error) {
    console.error('Failed to send message:', error);
    alert('Failed to send message. Please try again.');
    newMessage.value = text; // Restore text on failure
  } finally {
    sending.value = false;
  }
}

function scrollToBottom() {
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
  }
}

function getMessageStyle(userId) {
  const isMe = userId === props.currentUserId;
  return {
    maxWidth: '85%', 
    padding: '12px 18px', 
    borderRadius: '18px', 
    background: isMe ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#fff',
    color: isMe ? '#fff' : '#333',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    border: isMe ? 'none' : '1px solid #eee'
  };
}

onMounted(() => {
  fetchMessages();
  // Poll for new messages every 3 seconds to make it "Live"
  pollInterval = setInterval(fetchMessages, 3000);
});

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval);
});
</script>

<style scoped>
.chat-container {
  height: 600px; /* Fixed height for the entire component */
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  background: white;
  border: 2px solid #f0f0f0;
  border-radius: 15px;
  overflow: hidden;
}

.chat-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Critical for keeping input at bottom */
}

.chat-messages {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  padding: 25px;
  background: #f9faff;
}

.message-wrapper {
  display: flex;
  width: 100%;
  margin-bottom: 5px;
}

.message-wrapper.sent {
  justify-content: flex-end;
}

.message-wrapper.received {
  justify-content: flex-start;
}

.message-bubble {
  position: relative;
  transition: all 0.3s ease;
}

.message-data {
  font-size: 10px; 
  display: block; 
  margin-top: 4px;
  text-align: right;
}

.chat-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #b0b0b0;
  text-align: center;
}

.chat-empty svg {
  margin-bottom: 15px;
  opacity: 0.4;
}

.chat-empty p {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 5px;
}

.chat-input-container {
  padding: 20px;
  background: white;
  border-top: 2px solid #f0f0f0;
  flex-shrink: 0; /* Ensures it never gets squished */
}

.chat-form {
  display: flex;
  width: 100%;
  gap: 10px;
}

.chat-input {
  flex: 1;
  padding: 12px 20px;
  border: 2px solid #e0e0e0;
  border-radius: 50px;
  font-family: 'Syne', sans-serif;
  font-size: 15px;
  outline: none;
  transition: all 0.3s ease;
}

.chat-input:focus {
  border-color: #a78bfa;
}

.send-btn {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.send-btn:hover {
  transform: scale(1.05);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Custom Scrollbar */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}
.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}
.chat-messages::-webkit-scrollbar-thumb {
  background: #e0e0e0;
  border-radius: 10px;
}
</style>
