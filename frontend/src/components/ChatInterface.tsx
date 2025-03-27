import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Send, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Input } from './ui/input';
import { formatTime } from '@/utils/timeUtils';
import { getInitials } from '@/utils/getInitials';

type Message = {
  id: string;
  user: string;
  content: string;
  timestamp: Date;
  isCurrentUser: boolean;
};

const usernames = [
  'CyberRacer',
  'NeonDriver',
  'GridHacker',
  'SpeedPhantom',
  'QuantumLap',
  'VirtualPit',
  'TurboSynth',
  'ApexGlitch',
];

const initialMessages: Message[] = [
  {
    id: '1',
    user: 'CyberRacer',
    content: 'That overtake was insane! 🔥',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    isCurrentUser: false,
  },
  {
    id: '2',
    user: 'NeonDriver',
    content: 'Hamilton is pushing hard to catch Verstappen',
    timestamp: new Date(Date.now() - 1000 * 60 * 4),
    isCurrentUser: false,
  },
  {
    id: '3',
    user: 'GridHacker',
    content: 'The pit strategy is going to be crucial today',
    timestamp: new Date(Date.now() - 1000 * 60 * 3),
    isCurrentUser: false,
  },
  {
    id: '4',
    user: 'SpeedPhantom',
    content: 'Weather report says rain in 15 minutes!',
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
    isCurrentUser: false,
  },
  {
    id: '5',
    user: 'QuantumLap',
    content: 'Ferrari needs to fix those tire issues ASAP',
    timestamp: new Date(Date.now() - 1000 * 60 * 1),
    isCurrentUser: false,
  },
];

const randomMessages = [
  "What a race we're having today!",
  'That was a close call in turn 3',
  'The safety car might come out soon',
  'Amazing defensive driving!',
  'Those new upgrades are working well',
  'Pit stop in 2 laps, I think',
  'The gap is closing fast',
  "DRS enabled, let's see what happens",
  'Tire degradation is becoming an issue',
  'That McLaren is flying today!',
];

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [username] = useState('VirtualPit');
  const [isChatExpanded, setIsChatExpanded] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const scrollToBottomRef = useRef<HTMLDivElement>(null);

  // Memoized message count
  const messageCount = useMemo(() => messages.length, [messages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate new messages
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            user: usernames[Math.floor(Math.random() * usernames.length)],
            content:
              randomMessages[Math.floor(Math.random() * randomMessages.length)],
            timestamp: new Date(),
            isCurrentUser: false,
          },
        ]);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Send Message Handler (Memoized)
  const handleSendMessage = useCallback(() => {
    if (!newMessage.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        user: username,
        content: newMessage,
        timestamp: new Date(),
        isCurrentUser: true,
      },
    ]);
    setNewMessage('');
  }, [newMessage, username]);

  return (
    <div className='flex h-full max-h-[calc(100vh)-120px] flex-col lg:max-h-full'>
      {/* Chat Header */}
      <div className='flex items-center justify-between border-b border-white/10 bg-black/30 p-3'>
        <h2 className='text-base font-medium text-white/90'>Live Chat</h2>
        <div className='flex items-center space-x-2'>
          <span className='text-xs text-gray-400'>{messageCount} messages</span>
          <Button
            variant='ghost'
            size='icon'
            className='h-6 w-6 rounded-full hover:bg-white/5'
            onClick={() => setIsChatExpanded(!isChatExpanded)}
          >
            <ChevronDown
              size={14}
              className={`transition-transform duration-200 ${isChatExpanded ? '' : 'rotate-180'}`}
            />
          </Button>
        </div>
      </div>

      {/* Chat Messages */}
      <ScrollArea
        className={`flex-1 p-3 transition-all duration-300 ${
          isChatExpanded
            ? 'max-h-[calc(100vh-220px)] opacity-100'
            : 'max-h-0 overflow-hidden opacity-0'
        }`}
        ref={scrollAreaRef}
      >
        <div className='space-y-3'>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-2 ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              {!message.isCurrentUser && (
                <Avatar className='flex h-6 w-6 items-center justify-center bg-gray-800'>
                  <AvatarFallback className='bg-gray-800 text-xs text-white/90'>
                    {getInitials(message.user)}
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${message.isCurrentUser ? 'bg-gray-800 text-white/90' : 'bg-gray-900 text-white/90'}`}
              >
                <div className='mb-1 flex items-center justify-between gap-2'>
                  <span
                    className={`text-xs font-medium ${message.isCurrentUser ? 'text-white/70' : 'text-white/70'}`}
                  >
                    {message.user}
                  </span>
                  <span className='text-xs text-gray-500'>
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                <p className='text-white/90'>{message.content}</p>
              </div>
              {message.isCurrentUser && (
                <Avatar className='flex h-6 w-6 items-center justify-center bg-gray-800'>
                  <AvatarFallback className='bg-gray-800 text-xs text-white/90'>
                    {getInitials(message.user)}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          <div ref={scrollToBottomRef}></div>
        </div>
      </ScrollArea>

      {/* Chat Input */}
      <div
        className={`border-t border-purple-900/50 bg-gray-900 p-3 transition-all duration-300 ${
          isChatExpanded
            ? 'max-h-20 opacity-100'
            : 'max-h-0 overflow-hidden opacity-0'
        }`}
      >
        <form
          className='flex items-center gap-2'
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <Input
            placeholder='Type a message...'
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className='rounded-full border-white/10 bg-gray-900 focus-visible:ring-white/20'
          />
          <Button
            type='submit'
            size='icon'
            className='flex aspect-square h-10 w-10 items-center justify-center rounded-full bg-white/90 text-black hover:bg-white/80'
          >
            <Send size={16} />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
