import { Send } from 'lucide-react';

interface ChatInputProps {
  text: string;
  setText: (text: string) => void;
  sendMessage: () => void;
}

const ChatInput = ({ text, setText, sendMessage }: ChatInputProps) => (
  <div className='border-t border-white/10 bg-black/30 p-3'>
    <div className='flex items-center rounded-full bg-zinc-800 px-3 py-1'>
      <input
        id='chat'
        name='chat'
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        className='flex-1 bg-transparent px-2 py-1.5 text-sm text-white placeholder-zinc-500 focus:outline-none'
        aria-label='Type your message'
        placeholder='Radio check...'
        autoComplete='off'
      />
      <button
        onClick={sendMessage}
        disabled={!text.trim()}
        className='text-zinc-white ml-1 rounded-full p-1.5 transition-colors hover:bg-zinc-700 hover:text-white disabled:opacity-50'
        aria-label='Send message'
      >
        <Send size={16} />
      </button>
    </div>
  </div>
);

export default ChatInput;
