import { useState } from 'react';
import { Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

// Emoji categories without "Objects"
const emojiCategories = [
  {
    name: 'Smileys',
    emojis: [
      '😀',
      '😃',
      '😄',
      '😁',
      '😆',
      '😅',
      '😂',
      '🤣',
      '😊',
      '😇',
      '🙂',
      '🙃',
      '😉',
      '😌',
      '😍',
      '🥰',
      '😘',
    ],
  },
  {
    name: 'Racing',
    emojis: [
      '🏎️',
      '🏁',
      '🚥',
      '🏆',
      '🥇',
      '🥈',
      '🥉',
      '🔧',
      '⚡',
      '🔥',
      '💨',
      '🌪️',
      '🌟',
      '🚨',
      '🛞',
      '⛽',
      '🚦',
    ],
  },
  {
    name: 'Reactions',
    emojis: [
      '👍',
      '👎',
      '👏',
      '🙌',
      '🤝',
      '👊',
      '✌️',
      '🤞',
      '🤘',
      '🤙',
      '👌',
      '👈',
      '👉',
      '👆',
      '👇',
      '💪',
      '🙏',
    ],
  },
];

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

const EmojiPicker = ({ onEmojiSelect }: EmojiPickerProps) => {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='h-8 w-8 rounded-full text-white/80 hover:bg-white/10'
          aria-label='Add emoji'
        >
          <Smile size={18} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='w-64 border border-gray-700 bg-gray-800 p-0'
        side='top'
      >
        <div className='flex max-h-[300px] flex-col'>
          <div className='flex border-b border-gray-700 bg-gray-900'>
            {emojiCategories.map((category, index) => (
              <Button
                key={category.name}
                variant='ghost'
                size='sm'
                className={`flex-1 rounded-none py-1 text-xs ${
                  selectedCategory === index
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400'
                }`}
                onClick={() => setSelectedCategory(index)}
              >
                {category.name}
              </Button>
            ))}
          </div>
          <div className='grid grid-cols-7 gap-1 overflow-y-auto p-2'>
            {emojiCategories[selectedCategory].emojis.map((emoji) => (
              <Button
                key={emoji}
                variant='ghost'
                size='sm'
                className='h-8 w-8 p-0 hover:bg-gray-700'
                onClick={() => handleEmojiClick(emoji)}
              >
                <span className='text-lg'>{emoji}</span>
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicker;
