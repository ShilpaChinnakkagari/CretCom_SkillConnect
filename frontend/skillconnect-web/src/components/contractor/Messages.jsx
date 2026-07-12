import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Messages = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchChats();
    // Poll for new messages every 5 seconds
    const interval = setInterval(() => {
      if (selectedChat) {
        fetchMessages(selectedChat.id);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.id);
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChats = async () => {
    try {
      // Fetch all conversations
      const response = await axios.get('http://localhost:8080/messages/chats', {
        withCredentials: true
      });
      setChats(response.data || []);
    } catch (error) {
      console.error('Error fetching chats:', error);
      // Fallback with mock data
      setChats([
        {
          id: '1',
          userId: 'user1',
          name: 'Ravi Electricals',
          profilePhoto: null,
          lastMessage: 'When can you start the work?',
          lastMessageTime: '2026-07-12T14:30:00',
          unreadCount: 2,
          isOnline: true
        },
        {
          id: '2',
          userId: 'user2',
          name: 'Priya Interiors',
          profilePhoto: null,
          lastMessage: 'Can you send me the design?',
          lastMessageTime: '2026-07-12T12:15:00',
          unreadCount: 0,
          isOnline: false
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const response = await axios.get(`http://localhost:8080/messages/${chatId}`, {
        withCredentials: true
      });
      setMessages(response.data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Fallback with mock messages
      setMessages([
        {
          id: 'm1',
          senderId: 'user1',
          message: 'Hello, I need an electrician for my home.',
          createdAt: '2026-07-12T14:00:00',
          isRead: true
        },
        {
          id: 'm2',
          senderId: 'me',
          message: 'Hi, I am available. What work do you need?',
          createdAt: '2026-07-12T14:15:00',
          isRead: true
        },
        {
          id: 'm3',
          senderId: 'user1',
          message: 'I need to fix some wiring in my kitchen.',
          createdAt: '2026-07-12T14:30:00',
          isRead: false
        }
      ]);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    setSending(true);
    try {
      const response = await axios.post('http://localhost:8080/messages/send', {
        receiverId: selectedChat.userId,
        message: newMessage
      }, {
        withCredentials: true
      });

      if (response.data) {
        setMessages([...messages, response.data]);
        setNewMessage('');
        // Update chat list
        const updatedChats = chats.map(c => 
          c.id === selectedChat.id 
            ? { ...c, lastMessage: newMessage, lastMessageTime: new Date().toISOString() }
            : c
        );
        setChats(updatedChats);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return '👤';
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString();
  };

  const filteredChats = chats.filter(chat => 
    chat.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: '#161B22', border: '1px solid #30363D' }}>
      <div className="flex h-[600px]">
        
        {/* ===== LEFT PANEL - CHAT LIST ===== */}
        <div className="w-full md:w-80 flex-shrink-0 border-r border-gray-700 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-lg font-bold text-white">💬 Messages</h2>
            <div className="mt-2">
              <input
                type="text"
                placeholder="🔍 Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-[#0D1117] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {filteredChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
                <span className="text-4xl mb-2">💬</span>
                <p>No conversations yet</p>
              </div>
            ) : (
              filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-[#1C2333] transition ${
                    selectedChat?.id === chat.id ? 'bg-[#1C2333]' : ''
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden flex items-center justify-center text-lg">
                      {chat.profilePhoto ? (
                        <img src={chat.profilePhoto} alt={chat.name} className="w-full h-full object-cover" />
                      ) : (
                        getInitials(chat.name)
                      )}
                    </div>
                    {chat.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#161B22]"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="text-white font-medium truncate">{chat.name}</p>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {formatTime(chat.lastMessageTime)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-400 truncate flex-1">
                        {chat.lastMessage || 'No messages yet'}
                      </p>
                      {chat.unreadCount > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full flex-shrink-0">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ===== RIGHT PANEL - CONVERSATION ===== */}
        <div className="hidden md:flex flex-1 flex-col">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-700 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden flex items-center justify-center text-lg">
                  {selectedChat.profilePhoto ? (
                    <img src={selectedChat.profilePhoto} alt={selectedChat.name} className="w-full h-full object-cover" />
                  ) : (
                    getInitials(selectedChat.name)
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{selectedChat.name}</p>
                  <p className="text-xs text-gray-500">
                    {selectedChat.isOnline ? '🟢 Online' : 'Last seen recently'}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
                    <span className="text-4xl mb-2">💬</span>
                    <p>No messages yet</p>
                    <p className="text-xs">Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    const isMe = msg.senderId === 'me';
                    return (
                      <div
                        key={index}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            isMe
                              ? 'bg-blue-600 text-white'
                              : 'bg-[#0D1117] text-gray-300'
                          }`}
                        >
                          <p className="text-sm">{msg.message}</p>
                          <p className={`text-xs mt-1 ${isMe ? 'text-blue-200' : 'text-gray-500'}`}>
                            {formatTime(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={sendMessage} className="p-4 border-t border-gray-700 flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 bg-[#0D1117] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-sm"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {sending ? '⏳' : '📤'}
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <span className="text-6xl mb-4">💬</span>
              <p className="text-lg">Select a conversation</p>
              <p className="text-sm">Choose a chat to start messaging</p>
            </div>
          )}
        </div>

        {/* ===== MOBILE VIEW - Conversation ===== */}
        {selectedChat && (
          <div className="md:hidden flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-700 flex items-center gap-3">
              <button 
                onClick={() => setSelectedChat(null)}
                className="text-gray-400 hover:text-white text-lg"
              >
                ←
              </button>
              <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden flex items-center justify-center text-lg">
                {selectedChat.profilePhoto ? (
                  <img src={selectedChat.profilePhoto} alt={selectedChat.name} className="w-full h-full object-cover" />
                ) : (
                  getInitials(selectedChat.name)
                )}
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">{selectedChat.name}</p>
                <p className="text-xs text-gray-500">
                  {selectedChat.isOnline ? '🟢 Online' : 'Last seen recently'}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, index) => {
                const isMe = msg.senderId === 'me';
                return (
                  <div
                    key={index}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        isMe
                          ? 'bg-blue-600 text-white'
                          : 'bg-[#0D1117] text-gray-300'
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <p className={`text-xs mt-1 ${isMe ? 'text-blue-200' : 'text-gray-500'}`}>
                        {formatTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={sendMessage} className="p-4 border-t border-gray-700 flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 bg-[#0D1117] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-sm"
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || sending}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {sending ? '⏳' : '📤'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;