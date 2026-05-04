export const formatNumber = (num: string | number): string => {
  const parsed = Number(num);
  if (isNaN(parsed)) return "0";
  
  return new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 20, // Menjaga agar angka desimal di belakang koma tidak hilang/dibulatkan
  }).format(parsed);
};