'use client';

import type React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
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
  const [lastTypingTime, setLastTypingTime] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Focus input when replying
  useEffect(() => {
    if (replyingTo && inputRef.current) {
      inputRef.current.focus();
    }
  }, [replyingTo]);

  // Debounced typing handler to improve performance
  const debouncedTypingHandler = useCallback(() => {
    const now = Date.now();
    if (now - lastTypingTime > 2000) {
      onTyping();
      setLastTypingTime(now);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      onStopTyping();
    }, 3000);
  }, [lastTypingTime, onTyping, onStopTyping]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    debouncedTypingHandler();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');

      // Clear typing indicator
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      onStopTyping();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleBlur = () => {
    // Don't immediately stop typing on blur
    // This prevents flickering when clicking elsewhere in the UI
    setTimeout(() => {
      onStopTyping();
    }, 1000);
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className='w-full'>
      {/* Reply to text label */}
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
          >
            <X className='h-7 w-7 rounded-full p-1 text-gray-200 hover:bg-white/15' />
          </button>
        </div>
      )}

      {/* Chat input and send button */}
      <form onSubmit={handleSubmit} className='flex items-center gap-2'>
        <input
          ref={inputRef}
          type='text'
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
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
