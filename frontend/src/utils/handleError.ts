import axios from 'axios';

const getErrorMessage = (
  error: unknown,
  defaultMessage = 'An error occurred',
): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || defaultMessage;
  } else if (error instanceof Error) {
    return error.message;
  }
  return defaultMessage;
};

export default getErrorMessage;
