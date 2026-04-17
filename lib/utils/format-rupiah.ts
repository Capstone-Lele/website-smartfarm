const formatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

export const formatRupiah = (val: number) =>
  val === 0 ? "-" : formatter.format(val);
