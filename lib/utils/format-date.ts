export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  
  const day = date.getDate();
  const month = date.toLocaleDateString('id-ID', { month: 'long' });
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  if (isNaN(day) || isNaN(year) || isNaN(date.getHours()) || isNaN(date.getMinutes())) {
    return '-';
  }
  
  return `${day} ${month} ${year}, ${hours}:${minutes}`;
};