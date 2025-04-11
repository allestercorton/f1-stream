import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronUp, ChevronDown } from 'lucide-react';
import Message from './Message';
import ChatInput from './ChatInput';
import { socket } from '@/lib/socket';
import { useAuthStore } from '@/store/authStore';
import type { ChatMessage } from '@/types/message';

const ChatBox = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [isChatVisible, setIsChatVisible] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  // scroll to bottom if user is near bottom of the chat
  const scrollToBottom = () => {
    if (!messagesEndRef.current) return;
    const el = messagesEndRef.current;
    const container = el.parentElement;
    if (!container) return;

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      100;

    el.scrollIntoView({ behavior: isNearBottom ? 'smooth' : 'auto' });
  };

  // auto-scroll to bottom when messages update and chat is open
  useLayoutEffect(() => {
    if (isChatVisible && isAuthenticated && messages.length > 0) {
      const timeout = setTimeout(scrollToBottom, 0);
      return () => clearTimeout(timeout);
    }
  }, [messages, isChatVisible, isAuthenticated]);

  // on mount: fetch latest messages and listen for new ones
  useEffect(() => {
    const handleNewMessage = (msg: ChatMessage) => {
      // limit to latest 50 messages
      setMessages((prev) => [...prev.slice(-49), msg]);
    };

    const handleInitialMessages = (msgs: ChatMessage[]) => {
      setMessages(msgs);
    };

    socket.emit('getMessages');
    socket.on('messages', handleInitialMessages);
    socket.on('newMessage', handleNewMessage);

    // cleanup on unmount
    return () => {
      socket.off('messages', handleInitialMessages);
      socket.off('newMessage', handleNewMessage);
    };
  }, []);

  // emit new message to server
  const sendMessage = () => {
    if (!text.trim() || !user) return;

    const newMessage: ChatMessage = {
      userId: user.id,
      name: user.name,
      content: text.trim(),
      createdAt: new Date(),
    };

    socket.emit('sendMessage', newMessage);
    setText('');
  };

  return (
    <div className='flex h-full flex-col bg-black/20'>
      {/* chat header with toggle */}
      <div className='border-b border-white/10 bg-black/30 px-4 py-3'>
        <div className='flex items-center justify-between'>
          <h2 className='flex items-center font-medium'>
            <div className='mr-2 h-2 w-2 animate-pulse rounded-full bg-green-500'></div>
            live chat
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

      {/* chat messages and input */}
      {isChatVisible && (
        <>
          <div className='scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent flex-1 overflow-y-auto p-4'>
            {messages.map((msg, i) => (
              <Message
                key={`${msg.userId}-${i}`}
                msg={msg}
                isCurrentUser={user?.id === msg.userId}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* input box or sign in prompt */}
          {isAuthenticated ? (
            <ChatInput
              text={text}
              setText={setText}
              sendMessage={sendMessage}
            />
          ) : (
            <div className='border-t border-white/10 bg-black/30 p-4 text-center'>
              <Link
                to='/sign-in'
                className='cursor-pointer text-white hover:underline'
                aria-label='Link to sign in'
              >
                sign in
              </Link>{' '}
              <span className='text-white/50'>to join the conversation.</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ChatBox;
