export const INVENTORY_TYPE_OPTIONS = [
  { value: "in", label: "Masuk (In)" },
  { value: "out", label: "Keluar (Out)" },
];

export const INVENTORY_TRANSACTION_TYPE_OPTIONS = [
  { value: "grant", label: "Hibah (Grant)" },
  { value: "non-grant", label: "Reguler (Non-Grant)" },
];

export const inventoryTransactionTypeTranslation = (type?: string | null) => {
  if (type === "grant") return "Hibah (Grant)";
  if (type === "non-grant") return "Reguler (Non-Grant)";
  if (type === "-")
  return type;
}

export const INVENTORY_SUBMISSION_STATUS = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];