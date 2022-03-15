export const getFormattedDate = (postDate: Date) => {
  const now = new Date();
  let formatOptions: Intl.DateTimeFormatOptions;

  if (now.getFullYear() !== postDate.getFullYear())
    formatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  else if (now.getMonth() === postDate.getMonth() && now.getDate() === postDate.getDate())
    formatOptions = { hour: '2-digit', minute: '2-digit' };
  else formatOptions = { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };

  return postDate.toLocaleString('ru', formatOptions);
};
