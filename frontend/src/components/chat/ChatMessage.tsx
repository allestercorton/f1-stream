import type React from 'react';
import { useState } from 'react';
import { format } from 'date-fns';
import { EllipsisVertical, MessageSquare, Smile } from 'lucide-react';
import type { Message, User } from '../../types/chat';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ChatMessageProps {
  message: Message;
  currentUser: User | null;
  onReaction: (messageId: string, reaction: string) => void;
  onReply: (message: Message) => void;
  onSendReply: (text: string, messageId: string) => void;
  onEditMessage: (messageId: string, text: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onEditReply: (messageId: string, replyIndex: number, text: string) => void;
  onDeleteReply: (messageId: string, replyIndex: number) => void;
}

const ChatMessage = ({
  message,
  currentUser,
  onReaction,
  onReply,
  onSendReply,
  onEditMessage,
  onDeleteMessage,
  onEditReply,
  onDeleteReply,
}: ChatMessageProps) => {
  const [showReactions, setShowReactions] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingReplyIndex, setEditingReplyIndex] = useState<number | null>(
    null,
  );

  const isCurrentUserMessage =
    currentUser && message.user._id === currentUser._id;
  const messageTime = new Date(message.createdAt);
  const formattedTime = format(messageTime, 'h:mm a');

  // group reactions by type with null checks
  const reactionCounts: Record<string, { count: number; users: User[] }> = {};
  message.reactions?.forEach((reaction) => {
    if (!reaction.type || !reaction.user) return;

    if (!reactionCounts[reaction.type]) {
      reactionCounts[reaction.type] = { count: 0, users: [] };
    }
    reactionCounts[reaction.type].count += 1;
    if (reaction.user) {
      reactionCounts[reaction.type].users.push(reaction.user as User);
    }
  });

  // check if current user has reacted
  const currentUserReaction = message.reactions?.find(
    (r) => currentUser && r.user && r.user._id === currentUser._id,
  )?.type;

  const handleReactionClick = () => {
    setShowReactions(!showReactions);
  };

  const handleReplyClick = () => {
    if (currentUser) {
      onReply(message);
    }
  };

  const handleSendReply = (text: string) => {
    onSendReply(text, message._id);
    setShowReplyInput(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleEditSubmit = (text: string) => {
    onEditMessage(message._id, text);
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      onDeleteMessage(message._id);
    }
  };

  const handleEditReplyClick = (index: number) => {
    setEditingReplyIndex(index);
  };

  const handleEditReplySubmit = (text: string, index: number) => {
    onEditReply(message._id, index, text);
    setEditingReplyIndex(null);
  };

  const handleEditReplyCancel = () => {
    setEditingReplyIndex(null);
  };

  const handleDeleteReplyClick = (index: number) => {
    if (window.confirm('Are you sure you want to delete this reply?')) {
      onDeleteReply(message._id, index);
    }
  };

  // if message is deleted, show placeholder
  if (message.isDeleted) {
    return (
      <div
        className={`flex flex-col ${isCurrentUserMessage ? 'items-end' : 'items-start'} my-4`}
      >
        <div className='max-w-[85%] rounded-2xl bg-zinc-800/50 px-4 py-2 text-sm italic text-zinc-400 backdrop-blur-sm sm:max-w-[75%]'>
          <p>This message was deleted</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col ${isCurrentUserMessage ? 'items-end' : 'items-start'} my-4`}
    >
      <div
        className={`flex items-end gap-2 ${isCurrentUserMessage ? 'flex-row-reverse' : ''}`}
      >
        {!isCurrentUserMessage && (
          <div className='mb-1 h-8 w-8 flex-shrink-0 overflow-hidden rounded-full'>
            <img
              src={
                message.user.profilePicture ||
                `/placeholder.svg?height=32&width=32`
              }
              alt={message.user.displayName || 'User'}
              className='h-full w-full object-cover'
            />
          </div>
        )}

        {/* Message container with proper width */}
        <div
          className={`rounded-2xl px-4 py-3 shadow-sm backdrop-blur-sm ${isCurrentUserMessage ? 'bg-blue-600 text-white' : 'bg-zinc-800/70 text-white'}`}
          style={{
            maxWidth: '85%',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            width: 'fit-content',
          }}
        >
          {/* Only show username and timestamp for non-current user messages */}
          {!isCurrentUserMessage && (
            <div className='mb-1 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap'>
              <span className='text-sm font-medium'>
                {message.user.displayName || 'User'}
              </span>
              <span className='text-xs text-zinc-400'>{formattedTime}</span>
            </div>
          )}

          {/* Redesigned reply UI to be more like Messenger */}
          {message.replyTo && (
            <div className={`mb-2 overflow-hidden rounded-lg`}>
              <div
                className={`border-l-2 px-3 py-1.5 text-xs ${isCurrentUserMessage ? 'border-blue-400 bg-blue-700/50' : 'border-zinc-500 bg-zinc-700/50'}`}
              >
                <div className='mb-0.5 flex items-center gap-1'>
                  <div className='h-8 w-1 flex-shrink-0'></div>
                  <span className='text-xs font-medium text-zinc-300'>
                    {message.replyTo.user?.displayName
                      ? message.replyTo.user.displayName
                      : 'User'}
                  </span>
                </div>
                <p className='line-clamp-2 text-zinc-300'>
                  {message.replyTo.text}
                </p>
              </div>
            </div>
          )}

          {isEditing ? (
            <EditMessageForm
              initialText={message.text}
              onSubmit={handleEditSubmit}
              onCancel={handleEditCancel}
            />
          ) : (
            <>
              <p className='text-sm'>{message.text}</p>
              {message.editedAt && (
                <span
                  className={`text-xs ${isCurrentUserMessage ? 'text-blue-200' : 'text-zinc-400'} italic`}
                >
                  (edited)
                </span>
              )}
            </>
          )}

          {/* reactions display */}
          {Object.keys(reactionCounts).length > 0 && (
            <div className='mt-2 flex flex-wrap gap-1'>
              {Object.entries(reactionCounts).map(([reaction, data]) => (
                <div
                  key={reaction}
                  className={`flex items-center rounded-full px-2 py-0.5 text-xs ${
                    currentUserReaction === reaction
                      ? 'bg-zinc-600 font-medium text-white'
                      : 'bg-zinc-700/70 text-zinc-300'
                  }`}
                  title={data.users
                    .map((u) => u.displayName || 'User')
                    .join(', ')}
                >
                  <span className='mr-1'>{reaction}</span>
                  <span>{data.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* message actions with tooltips */}
      <div
        className={`mt-2 flex gap-3 text-xs ${isCurrentUserMessage ? 'mr-2' : 'ml-10'}`}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleReactionClick}
                className='flex items-center gap-1 text-zinc-400 transition-colors hover:text-zinc-200'
              >
                <Smile size={16} />
              </button>
            </TooltipTrigger>
            <TooltipContent side='bottom'>
              <p>React</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleReplyClick}
                className='flex items-center gap-1 text-zinc-400 transition-colors hover:text-zinc-200'
              >
                <MessageSquare size={16} />
              </button>
            </TooltipTrigger>
            <TooltipContent side='bottom'>
              <p>Reply</p>
            </TooltipContent>
          </Tooltip>

          {isCurrentUserMessage && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className='relative'>
                  <MessageActions
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side='bottom'>
                <p>More options</p>
              </TooltipContent>
            </Tooltip>
          )}
        </TooltipProvider>
      </div>

      {/* reaction selector */}
      {showReactions && (
        <div className={`mt-1 ${isCurrentUserMessage ? 'mr-2' : 'ml-10'}`}>
          <ReactionSelector
            onSelectReaction={(reaction) => {
              onReaction(message._id, reaction);
              setShowReactions(false);
            }}
          />
        </div>
      )}

      {/* replies - simplified and more minimal */}
      {message.replies && message.replies.length > 0 && (
        <div
          className={`mt-2 space-y-2 ${isCurrentUserMessage ? 'mr-2' : 'ml-10'}`}
        >
          {message.replies.map((reply, index) => {
            const isCurrentUserReply =
              currentUser && reply.user && reply.user._id === currentUser._id;
            const replyTime = new Date(reply.createdAt);
            const formattedReplyTime = format(replyTime, 'h:mm a');

            // if reply is deleted, show placeholder
            if (reply.isDeleted) {
              return (
                <div
                  key={index}
                  className='max-w-[95%] rounded-xl bg-zinc-800/50 px-3 py-1.5 text-sm italic text-zinc-400'
                >
                  <p>This reply was deleted</p>
                </div>
              );
            }

            return (
              <div
                key={index}
                className={`w-full rounded-xl px-3 py-2 ${isCurrentUserReply ? 'ml-auto bg-blue-500 text-white' : 'bg-zinc-800/70 text-white'}`}
                style={{
                  maxWidth: '95%',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  width: 'fit-content',
                }}
              >
                {!isCurrentUserReply && (
                  <div className='mb-0.5 flex flex-wrap items-center justify-between gap-1 sm:flex-nowrap'>
                    <span className='text-xs font-medium'>
                      {reply.user?.displayName || 'User'}
                    </span>
                    <span className='text-xs text-zinc-400'>
                      {formattedReplyTime}
                    </span>
                  </div>
                )}

                {editingReplyIndex === index ? (
                  <EditMessageForm
                    initialText={reply.text}
                    onSubmit={(text) => handleEditReplySubmit(text, index)}
                    onCancel={handleEditReplyCancel}
                    isReply
                  />
                ) : (
                  <>
                    <p className='text-sm'>{reply.text}</p>
                    {reply.editedAt && (
                      <span
                        className={`text-xs ${isCurrentUserReply ? 'text-blue-200' : 'text-zinc-400'} italic`}
                      >
                        (edited)
                      </span>
                    )}
                  </>
                )}

                {isCurrentUserReply && (
                  <div className='mt-1 flex justify-end gap-2'>
                    <button
                      onClick={() => handleEditReplyClick(index)}
                      className='text-xs text-blue-200 hover:underline'
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteReplyClick(index)}
                      className='text-xs text-blue-200 hover:underline'
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* reply input */}
      {showReplyInput && (
        <div
          className={`mt-2 w-full max-w-[90%] ${isCurrentUserMessage ? 'mr-2' : 'ml-10'}`}
        >
          <ReplyInput
            onSendReply={handleSendReply}
            onCancel={() => setShowReplyInput(false)}
            replyingToUser={message.user?.displayName || 'User'}
          />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;

// helper components
const EditMessageForm = ({
  initialText,
  onSubmit,
  onCancel,
  isReply = false,
}: {
  initialText: string;
  onSubmit: (text: string) => void;
  onCancel: () => void;
  isReply?: boolean;
}) => {
  const [text, setText] = useState(initialText);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='mt-1'>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className='w-full rounded-lg bg-zinc-900/70 p-2 text-sm text-white placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-500'
        rows={isReply ? 2 : 3}
        autoFocus
      />
      <div className='mt-1 flex justify-end gap-2'>
        <button
          type='button'
          onClick={onCancel}
          className='rounded px-2 py-1 text-xs text-zinc-400 hover:text-zinc-200'
        >
          Cancel
        </button>
        <button
          type='submit'
          className='rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-500'
        >
          Save
        </button>
      </div>
    </form>
  );
};

// Fix the error with reactions by adding null checks
// Update the ReactionSelector component to handle undefined users
const ReactionSelector = ({
  onSelectReaction,
}: {
  onSelectReaction: (reaction: string) => void;
}) => {
  const reactions = ['👍', '❤️', '😂', '😮', '😢', '👏'];

  return (
    <div className='flex flex-wrap gap-1 rounded-full bg-zinc-800/90 p-1 backdrop-blur-sm'>
      {reactions.map((reaction) => (
        <button
          key={reaction}
          onClick={() => onSelectReaction(reaction)}
          className='rounded-full p-1.5 text-lg transition-colors hover:bg-zinc-700'
          aria-label={`React with ${reaction}`}
        >
          {reaction}
        </button>
      ))}
    </div>
  );
};

const ReplyInput = ({
  onSendReply,
  onCancel,
  replyingToUser,
}: {
  onSendReply: (text: string) => void;
  onCancel: () => void;
  replyingToUser: string;
}) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSendReply(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className='w-full'>
      <div className='mb-1 flex items-center text-xs text-zinc-400'>
        <span>
          Replying to{' '}
          <span className='font-medium text-zinc-300'>{replyingToUser}</span>
        </span>
        <button
          type='button'
          onClick={onCancel}
          className='ml-2 text-zinc-500 hover:text-zinc-300'
        >
          Cancel
        </button>
      </div>
      <div className='flex gap-2'>
        <input
          type='text'
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='Type your reply...'
          className='flex-1 rounded-full bg-zinc-800/70 px-4 py-1.5 text-sm text-white placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-500'
          autoFocus
        />
        <button
          type='submit'
          disabled={!text.trim()}
          className='rounded-full bg-blue-600 px-3 py-1 text-sm text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50'
        >
          Send
        </button>
      </div>
    </form>
  );
};

// Updated MessageActions component to ensure the menu floats above content
const MessageActions = ({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className='relative'>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className='flex items-center gap-1 text-zinc-400 transition-colors hover:text-zinc-200'
      >
        <EllipsisVertical size={16} />
      </button>

      {showMenu && (
        <div className='absolute right-0 top-6 z-50 min-w-[100px] rounded-lg bg-zinc-800 py-1 shadow-lg'>
          <button
            onClick={() => {
              onEdit();
              setShowMenu(false);
            }}
            className='w-full px-3 py-1.5 text-left text-sm text-zinc-200 transition-colors hover:bg-zinc-700'
          >
            Edit
          </button>
          <button
            onClick={() => {
              onDelete();
              setShowMenu(false);
            }}
            className='w-full px-3 py-1.5 text-left text-sm text-red-400 transition-colors hover:bg-zinc-700'
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};
