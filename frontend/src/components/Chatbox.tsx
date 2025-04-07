import { useEffect, useState, useRef } from 'react';
import { Send, ChevronUp, ChevronDown } from 'lucide-react';
import Message from './Message';
import { socket } from '@/lib/socket';
import { useAuthStore } from '@/store/authStore';
import type { ChatMessage } from '@/types/message';
import { API_URL } from '@/utils/api';

const ChatBox = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [isChatVisible, setIsChatVisible] = useState(true);
  const user = useAuthStore((s) => s.user);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // setup socket listeners and fetch initial messages
  useEffect(() => {
    const handleNewMessage = (msg: ChatMessage) => {
      setMessages((prev) => [...prev.slice(-49), msg]);
    };

    const handleInitialMessages = (msgs: ChatMessage[]) => {
      setMessages(msgs);
    };

    // initialize socket connection and listeners
    socket.emit('getMessages');
    socket.on('messages', handleInitialMessages);
    socket.on('newMessage', handleNewMessage);

    // clean up listeners on unmount
    return () => {
      socket.off('messages', handleInitialMessages);
      socket.off('newMessage', handleNewMessage);
    };
  }, []);

  // handle sending new messages
  const sendMessage = () => {
    if (!text.trim() || !user) return;

    const newMessage: ChatMessage = {
      userId: user._id,
      name: user.displayName,
      avatar: user.profilePicture,
      content: text.trim(),
      createdAt: new Date(),
    };

    socket.emit('sendMessage', newMessage);
    setText('');
  };

  return (
    <div className='flex h-full flex-col bg-black/20'>
      {/* Header */}
      <div className='border-b border-white/10 bg-black/30 px-4 py-3'>
        <div className='flex items-center justify-between'>
          <h2 className='flex items-center font-medium'>
            <div className='mr-2 h-2 w-2 animate-pulse rounded-full bg-green-500'></div>
            Live Chat
          </h2>
          <button
            onClick={() => setIsChatVisible(!isChatVisible)}
            className='text-zinc-400 hover:text-white'
            aria-label={isChatVisible ? 'Hide chat' : 'Show chat'}
          >
            {isChatVisible ? (
              <ChevronDown size={20} />
            ) : (
              <ChevronUp size={20} />
            )}
          </button>
        </div>
      </div>

      {/* Messages container - only show when chat is visible */}
      {isChatVisible && (
        <>
          <div className='scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent flex-1 overflow-y-auto p-4'>
            {messages.map((msg, i) => (
              <Message
                key={`${msg.userId}-${i}`}
                msg={msg}
                isCurrentUser={user?._id === msg.userId}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area - only show when chat is visible */}
          {user ? (
            <div className='border-t border-white/10 bg-black/30 p-3'>
              <div className='flex items-center rounded-full bg-zinc-800 px-3 py-1'>
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  className='flex-1 bg-transparent px-2 py-1.5 text-sm text-white placeholder-zinc-500 focus:outline-none'
                  placeholder='Radio check...'
                  aria-label='Type your message'
                />
                <button
                  onClick={sendMessage}
                  disabled={!text.trim()}
                  className='ml-1 rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white disabled:opacity-50'
                  aria-label='Send message'
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className='border-t border-white/10 bg-black/30 p-4 text-center'>
              <a
                href={`${API_URL}/auth/google`}
                className='inline-block rounded-full bg-zinc-800 px-6 py-2 text-sm font-medium text-white/80 transition-all hover:bg-zinc-700'
              >
                Sign in to join the conversation
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ChatBox;
