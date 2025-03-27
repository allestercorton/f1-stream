import { Button } from './ui/button';
import { LoaderCircle } from 'lucide-react';

interface FormButtonProps {
  isLoading?: boolean;
  name: string;
}

const FormButton = ({ isLoading = false, name }: FormButtonProps) => (
  <Button
    type='submit'
    className='flex w-full items-center justify-center gap-2 bg-white text-black hover:bg-white/90'
    disabled={isLoading}
  >
    {isLoading ? (
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
