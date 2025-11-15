import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  MessageCircle,
  Send,
  Phone,
  Video,
  MoreVertical,
  Search,
  Paperclip,
  Mic,
  Image,
  Calendar,
  Star,
  Clock,
  CheckCircle,
  Music,
  Crown,
  Sparkles
} from 'lucide-react';

export function ClientChat() {
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const chats = [
    {
      id: 1,
      clientName: 'Priya & Rohit Sharma',
      clientAvatar: '👰',
      eventType: 'Wedding Reception',
      lastMessage: 'Thank you so much! The performance was absolutely amazing!',
      timestamp: '2 hours ago',
      unread: 0,
      status: 'completed',
      eventDate: '2024-02-25',
      isOnline: false,
      messages: [
        {
          id: 1,
          sender: 'client',
          message: 'Hi! We are interested in booking you for our wedding reception on Feb 25th.',
          timestamp: '2024-02-10 10:30',
          type: 'text'
        },
        {
          id: 2,
          sender: 'artist',
          message: 'Hello! Congratulations on your upcoming wedding! I would love to be part of your special day. Could you share more details about the event?',
          timestamp: '2024-02-10 11:15',
          type: 'text'
        },
        {
          id: 3,
          sender: 'client',
          message: 'It will be at Grand Ballroom, Hotel Taj from 7 PM to 11 PM. Around 300 guests expected.',
          timestamp: '2024-02-10 11:30',
          type: 'text'
        },
        {
          id: 4,
          sender: 'client',
          message: 'We prefer Bollywood hits and some classic songs for the elderly guests.',
          timestamp: '2024-02-10 11:31',
          type: 'text'
        },
        {
          id: 5,
          sender: 'artist',
          message: 'Perfect! I have extensive experience with wedding receptions. My rate for this would be ₹45,000 with ₹15,000 advance. I can share my playlist for your approval.',
          timestamp: '2024-02-10 12:00',
          type: 'text'
        },
        {
          id: 6,
          sender: 'client',
          message: '🎵 Wedding_Playlist_Sample.mp3',
          timestamp: '2024-02-12 14:20',
          type: 'audio'
        },
        {
          id: 7,
          sender: 'client',
          message: 'Love the playlist! Let\'s confirm the booking.',
          timestamp: '2024-02-12 15:30',
          type: 'text'
        },
        {
          id: 8,
          sender: 'artist',
          message: 'Fantastic! I\'ll send you the contract and payment details.',
          timestamp: '2024-02-12 16:00',
          type: 'text'
        },
        {
          id: 9,
          sender: 'client',
          message: 'Thank you so much! The performance was absolutely amazing!',
          timestamp: '2024-02-26 23:30',
          type: 'text'
        }
      ]
    },
    {
      id: 2,
      clientName: 'TechCorp Solutions',
      clientAvatar: '🏢',
      eventType: 'Corporate Annual Party',
      lastMessage: 'Can we schedule a call to discuss the music preferences?',
      timestamp: '1 day ago',
      unread: 2,
      status: 'confirmed',
      eventDate: '2024-03-05',
      isOnline: true,
      messages: [
        {
          id: 1,
          sender: 'client',
          message: 'Hello! We are organizing our annual corporate party on March 5th and would like to book you.',
          timestamp: '2024-02-12 09:00',
          type: 'text'
        },
        {
          id: 2,
          sender: 'artist',
          message: 'Hello! I\'d be happy to help make your corporate event memorable. Could you share the event details?',
          timestamp: '2024-02-12 09:30',
          type: 'text'
        },
        {
          id: 3,
          sender: 'client',
          message: 'It\'s from 6 PM to 10 PM at Conference Hall A, around 150 employees will be attending.',
          timestamp: '2024-02-12 10:00',
          type: 'text'
        },
        {
          id: 4,
          sender: 'client',
          message: 'Can we schedule a call to discuss the music preferences?',
          timestamp: '2024-02-13 14:30',
          type: 'text'
        }
      ]
    },
    {
      id: 3,
      clientName: 'Anil Kumar',
      clientAvatar: '🎂',
      eventType: 'Birthday Celebration',
      lastMessage: 'Looking forward to the party on Feb 20th!',
      timestamp: '3 days ago',
      unread: 0,
      status: 'confirmed',
      eventDate: '2024-02-20',
      isOnline: false,
      messages: [
        {
          id: 1,
          sender: 'client',
          message: 'Hi! I want to book you for my birthday party on Feb 20th.',
          timestamp: '2024-02-05 16:00',
          type: 'text'
        },
        {
          id: 2,
          sender: 'artist',
          message: 'Happy early birthday! I\'d love to make your celebration special. Tell me more about the party!',
          timestamp: '2024-02-05 16:30',
          type: 'text'
        },
        {
          id: 3,
          sender: 'client',
          message: 'It\'s at my home from 8 PM to midnight. About 50 people, mix of old and new Bollywood songs preferred.',
          timestamp: '2024-02-05 17:00',
          type: 'text'
        },
        {
          id: 4,
          sender: 'client',
          message: 'Looking forward to the party on Feb 20th!',
          timestamp: '2024-02-17 19:00',
          type: 'text'
        }
      ]
    },
    {
      id: 4,
      clientName: 'Meera Shah',
      clientAvatar: '💃',
      eventType: 'Sangeet Night',
      lastMessage: 'Could you send me your portfolio video?',
      timestamp: '5 days ago',
      unread: 1,
      status: 'inquiry',
      eventDate: '2024-03-15',
      isOnline: true,
      messages: [
        {
          id: 1,
          sender: 'client',
          message: 'Hi! I saw your profile and I\'m interested in booking you for our sangeet ceremony.',
          timestamp: '2024-02-09 20:00',
          type: 'text'
        },
        {
          id: 2,
          sender: 'artist',
          message: 'Thank you for reaching out! Sangeet nights are always so much fun. I\'d love to be part of your celebration.',
          timestamp: '2024-02-09 20:30',
          type: 'text'
        },
        {
          id: 3,
          sender: 'client',
          message: 'Could you send me your portfolio video?',
          timestamp: '2024-02-09 21:00',
          type: 'text'
        }
      ]
    }
  ];

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;
    
    const message = {
      id: selectedChat.messages.length + 1,
      sender: 'artist',
      message: newMessage,
      timestamp: new Date().toLocaleString(),
      type: 'text'
    };
    
    selectedChat.messages.push(message);
    setNewMessage('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'confirmed': return 'status-confirmed';
      case 'inquiry': return 'status-pending';
      default: return 'badge-artist';
    }
  };

  const filteredChats = chats.filter(chat =>
    chat.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.eventType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <MessageCircle className="w-8 h-8 text-artist-neon-purple" />
          Client Messages
        </h1>
        <div className="flex gap-3">
          <Badge className="badge-artist">
            <Clock className="w-4 h-4 mr-2" />
            {chats.reduce((sum, chat) => sum + chat.unread, 0)} unread
          </Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Chat List */}
        <div className="lg:col-span-1">
          <Card className="card-artist h-full flex flex-col">
            <CardHeader>
              <div className="space-y-4">
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-artist-gold" />
                  Conversations
                </CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search chats..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-secondary border-secondary text-white"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              <div className="space-y-2">
                {filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedChat(chat)}
                    className={`p-4 rounded-xl cursor-pointer transition-all hover:bg-secondary/50 ${
                      selectedChat?.id === chat.id ? 'bg-artist-neon-purple/20 border border-artist-neon-purple/50' : 'bg-secondary/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="w-12 h-12 border border-artist-gold/50">
                          <AvatarFallback className="bg-artist-neon-purple text-white text-xl">
                            {chat.clientAvatar}
                          </AvatarFallback>
                        </Avatar>
                        {chat.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-card rounded-full"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-white truncate">{chat.clientName}</h4>
                          {chat.unread > 0 && (
                            <Badge className="bg-artist-gold text-black text-xs">
                              {chat.unread}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`text-xs ${getStatusColor(chat.status)}`}>
                            {chat.eventType}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground truncate">
                          {chat.lastMessage}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {chat.timestamp}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Window */}
        <div className="lg:col-span-2">
          {selectedChat ? (
            <Card className="card-artist h-full flex flex-col">
              {/* Chat Header */}
              <CardHeader className="border-b border-secondary">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12 border border-artist-gold/50">
                      <AvatarFallback className="bg-artist-neon-purple text-white text-xl">
                        {selectedChat.clientAvatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-white">{selectedChat.clientName}</h3>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(selectedChat.status)}>
                          {selectedChat.eventType}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Event: {new Date(selectedChat.eventDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-white hover:bg-secondary/30">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-secondary/30">
                      <Video className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-secondary/30">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {selectedChat.messages.map((message: any) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'artist' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                          message.sender === 'artist'
                            ? 'chat-bubble-sent'
                            : 'chat-bubble-received'
                        }`}
                      >
                        {message.type === 'audio' ? (
                          <div className="flex items-center gap-2">
                            <Music className="w-4 h-4" />
                            <span className="text-sm">{message.message}</span>
                          </div>
                        ) : (
                          <p className="text-sm">{message.message}</p>
                        )}
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>

              {/* Message Input */}
              <div className="p-4 border-t border-secondary">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-secondary/30">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-secondary/30">
                    <Image className="w-4 h-4" />
                  </Button>
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className="bg-secondary border-secondary text-white pr-12"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white hover:bg-secondary/30"
                    >
                      <Mic className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button 
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="btn-artist"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="card-artist h-full flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Select a conversation</h3>
                <p className="text-muted-foreground">Choose a chat from the left to start messaging</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}