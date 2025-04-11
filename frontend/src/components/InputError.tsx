interface InputErrorProps {
    errors?: Record<string, { message?: string }>;
    field: string;
  }
  
  const InputError = ({ errors, field }: InputErrorProps) => {
    if (!errors?.[field]?.message) return null;
  
    return <p className='mt-1 text-sm text-red-600'>{errors[field].message}</p>;
  };
  
  export default InputError;
  