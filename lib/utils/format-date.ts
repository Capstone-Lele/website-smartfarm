
// format example: 25 Desember 2023, 14:30
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  
  const day = date.getDate();
  // const month = date.toLocaleDateString('id-ID', { month: 'long' });
  const month = date.toLocaleDateString('id-ID', { month: 'short' });
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  if (isNaN(day) || isNaN(year) || isNaN(date.getHours()) || isNaN(date.getMinutes())) {
    return '-';
  }
  
  return `${day} ${month} ${year}, ${hours}:${minutes}`;
};

// format example: 25 Desember 2023
export const formatDateLong = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate();
  // const month = date.toLocaleDateString('id-ID', { month: 'long' });
  const month = date.toLocaleDateString('id-ID', { month: 'short' });
  const year = date.getFullYear();

  if (isNaN(day) || isNaN(year)) {
    return '-';
  }

  return `${day} ${month} ${year}`;
};

// format example: 25/12/2023
export const formatDateShort = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  if (isNaN(date.getDate()) || isNaN(date.getMonth()) || isNaN(year)) {
    return '-';
  }
  return `${day}/${month}/${year}`;
}