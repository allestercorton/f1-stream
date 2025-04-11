// Format timestamp to show only hours and minutes
export const formatTime = (dateString: string | Date) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
