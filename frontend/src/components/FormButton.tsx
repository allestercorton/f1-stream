import { Button } from './ui/button';
import { LoaderCircle } from 'lucide-react';

interface FormButtonProps {
  isPending?: boolean;
  name: string;
}

const FormButton = ({ isPending = false, name }: FormButtonProps) => (
  <Button
    type='submit'
    className='flex w-full items-center justify-center gap-2 bg-white text-black hover:bg-white/90'
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
