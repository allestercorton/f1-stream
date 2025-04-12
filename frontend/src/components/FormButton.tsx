import { Button } from './ui/button';
import { LoaderCircle } from 'lucide-react';

interface FormButtonProps {
  isPending?: boolean;
  name: string;
}

const FormButton = ({ isPending = false, name }: FormButtonProps) => (
  <Button
    type='submit'
    className='flex w-full items-center justify-center gap-2 rounded-md bg-white px-4 py-3 text-sm font-medium text-black transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 disabled:opacity-50'
    disabled={isPending}
  >
    {isPending ? (
      <>
        <LoaderCircle className='h-4 w-4 animate-spin' />
        <span>Processing...</span>
      </>
    ) : (
      name
    )}
  </Button>
);

export default FormButton;
