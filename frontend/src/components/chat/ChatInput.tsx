import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Send, X } from 'lucide-react';
import type { Message } from '../../types/chat';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  onTyping: () => void;
  onStopTyping: () => void;
  replyingTo: Message | null;
  onCancelReply: () => void;
}

const ChatInput = ({
  onSendMessage,
  onTyping,
  onStopTyping,
  replyingTo,
  onCancelReply,
}: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // focus input when replying to a message
  useEffect(() => {
    if (replyingTo && inputRef.current) {
      inputRef.current.focus();
    }
  }, [replyingTo]);

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      onTyping();
    }

    // clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      onStopTyping();
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (message.trim()) {
      onSendMessage(message);
      setMessage('');

      // clear typing indicator
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      setIsTyping(false);
      onStopTyping();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // send on Enter (without shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className='w-full'>
      {replyingTo && (
        <div className='mb-3 flex items-center justify-between px-3'>
          <div className='space-y-1'>
            <div className='text-sm text-gray-200'>
              Replying to {replyingTo.user.displayName}
            </div>
            <div className='truncate text-xs italic text-gray-400'>
              {replyingTo.text}
            </div>
          </div>
          <button
            onClick={onCancelReply}
            className='text-gray-500 hover:text-gray-700'
            aria-label='Cancel reply'
          >
            <X className='h-7 w-7 rounded-full p-1 text-gray-200 hover:bg-white/15' />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className='flex items-center gap-2'>
        <input
          ref={inputRef}
          type='text'
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping();
          }}
          onKeyDown={handleKeyDown}
          placeholder='Radio check...'
          className='flex-1 rounded-full bg-gray-800 px-4 py-2 text-white/90 focus:border-transparent focus:outline-none'
        />
        <button
          type='submit'
          disabled={!message.trim()}
          aria-label='Send message'
          className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 p-2 text-white disabled:opacity-50'
        >
          <Send className='h-5 w-5' />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
