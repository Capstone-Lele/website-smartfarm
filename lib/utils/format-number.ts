export const formatNumber = (num: string | number): string => {
  const parsed = Number(num);
  if (isNaN(parsed)) return "0";
  
  return new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 20, // Menjaga agar angka desimal di belakang koma tidak hilang/dibulatkan
  }).format(parsed);
};

// format number di bulatkan ke bawah, misal 1.9 menjadi 1, 2.1 menjadi 2
export const formatNumberFloor = (num: string | number): string => {
  const parsed = Math.floor(Number(num));
  if (isNaN(parsed)) return "0";

  return new Intl.NumberFormat("id-ID").format(parsed);
}