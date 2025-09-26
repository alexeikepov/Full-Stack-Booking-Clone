import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Send,
  Users,
  Phone,
  Video,
  MoreVertical,
  Search,
  Paperclip,
  Smile,
  Image as ImageIcon,
  FileText,
  Hotel,
  UserPlus
} from "lucide-react";
import {
  getMyChats,
  getOrCreateChat,
  getChatMessages,
  sendMessage,
  markMessagesAsRead,
  getUnreadCount,
  getFriends,
  type Chat,
  type Message,
  type Friend,
  type SendMessageData
} from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function Chat() {
  const { user: currentUser } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      loadMessages();
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [chatsList, friendsList, unread] = await Promise.all([
        getMyChats(),
        getFriends(),
        getUnreadCount()
      ]);
      setChats(chatsList);
      setFriends(friendsList);
      setUnreadCount(unread.unreadCount);
    } catch (error) {
      alert("Failed to load chat data");
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    if (!selectedChat) return;

    try {
      const messagesList = await getChatMessages(selectedChat._id);
      setMessages(messagesList);
      
      // Mark messages as read
      await markMessagesAsRead(selectedChat._id);
      await loadData(); // Refresh unread count
    } catch (error) {
      alert("Failed to load messages");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const messageData: SendMessageData = {
        content: newMessage.trim(),
        type: 'text'
      };

      const sentMessage = await sendMessage(selectedChat._id, messageData);
      setMessages(prev => [...prev, sentMessage]);
      setNewMessage("");
      await loadData(); // Refresh chats list
    } catch (error) {
      alert("Failed to send message");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startChatWithFriend = async (friend: Friend) => {
    try {
      const chat = await getOrCreateChat(friend._id);
      setSelectedChat(chat);
      await loadData(); // Refresh chats list
    } catch (error) {
      alert("Failed to start chat");
    }
  };

  const getOtherParticipant = (chat: Chat) => {
    return chat.participants.find(p => p._id !== currentUser?.id);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString();
    }
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="h-4 w-4" />;
      case 'file': return <FileText className="h-4 w-4" />;
      case 'hotel_share': return <Hotel className="h-4 w-4" />;
      case 'group_invite': return <UserPlus className="h-4 w-4" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[600px] bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Chats</h2>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">
                <Search className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {unreadCount > 0 && (
            <Badge className="bg-red-100 text-red-800">
              {unreadCount} unread messages
            </Badge>
          )}
        </div>

        {/* Friends List */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Start New Chat</h3>
          <div className="space-y-2">
            {friends.slice(0, 3).map((friend) => (
              <div
                key={friend._id}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                onClick={() => startChatWithFriend(friend)}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {friend.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{friend.name}</p>
                  <p className="text-xs text-gray-500 truncate">{friend.email}</p>
                </div>
                <Button size="sm" variant="outline">
                  <MessageCircle className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Chats List */}
        <div className="flex-1 overflow-y-auto">
          {chats.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No chats yet</p>
              <p className="text-xs">Start a conversation with a friend</p>
            </div>
          ) : (
            <div className="space-y-1">
              {chats.map((chat) => {
                const otherParticipant = getOtherParticipant(chat);
                if (!otherParticipant) return null;

                return (
                  <div
                    key={chat._id}
                    className={`p-3 hover:bg-gray-50 cursor-pointer border-l-2 ${
                      selectedChat?._id === chat._id ? 'border-blue-500 bg-blue-50' : 'border-transparent'
                    }`}
                    onClick={() => setSelectedChat(chat)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {otherParticipant.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium truncate">{otherParticipant.name}</p>
                          {chat.lastMessageAt && (
                            <p className="text-xs text-gray-500">
                              {formatTime(chat.lastMessageAt)}
                            </p>
                          )}
                        </div>
                        {chat.lastMessage && (
                          <div className="flex items-center gap-1">
                            {getMessageIcon(chat.lastMessage.type)}
                            <p className="text-xs text-gray-600 truncate">
                              {chat.lastMessage.content}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {getOtherParticipant(selectedChat)?.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{getOtherParticipant(selectedChat)?.name}</p>
                    <p className="text-sm text-gray-600">Online</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No messages yet</p>
                  <p className="text-sm">Start the conversation!</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message._id}
                    className={`flex ${message.sender._id === currentUser?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-2 max-w-xs lg:max-w-md ${message.sender._id === currentUser?.id ? 'flex-row-reverse' : ''}`}>
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {message.sender.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`rounded-lg px-4 py-2 ${
                        message.sender._id === currentUser?.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-900'
                      }`}>
                        {message.type !== 'text' && (
                          <div className="flex items-center gap-1 mb-1">
                            {getMessageIcon(message.type)}
                            <span className="text-xs opacity-75">
                              {message.type.replace('_', ' ')}
                            </span>
                          </div>
                        )}
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender._id === currentUser?.id ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {formatTime(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Smile className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">Select a chat</h3>
              <p className="text-sm">Choose a conversation from the sidebar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
