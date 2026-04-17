export const FINANCE_TYPE_OPTIONS = [
  { value: "in", label: "Pemasukan" },
  { value: "out", label: "Pengeluaran" },
];

export const SOURCE_LABELS = [
  { value: "non_inventory", label: "Non Inventaris" },
  { value: "commodity_sales", label: "Penjualan Komoditas" },
  { value: "inventory_notes", label: "Inventaris" },
  { value: "inventory_submission", label: "Pengajuan Inventaris" },
];

export const sourceLabelTranslation = (value: string): string => {
  return SOURCE_LABELS.find((item) => item.value === value)?.label || "-";
};