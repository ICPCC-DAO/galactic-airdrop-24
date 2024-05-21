// Provide a date as UNIX (in seconds) and get a string with the date in the format DD/MM. 
export const getFormattedDate = (date: number): string => {
  const d = new Date(date * 1000);
  const month = d.toLocaleString('default', { month: 'short' });
  const day = d.getDate();
  return `${day} ${month}`;
};
