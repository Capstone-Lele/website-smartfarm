export const POOLS_CATEGORY = [
  { value: "growing", label: "Pembesaran", color: "blue" },
  { value: "breeding", label: "Pembibitan", color: "green" },
  { value: "quarantine", label: "Karantina", color: "yellow" },
];

export const poolsTranlate = (pool: string) => {
  return POOLS_CATEGORY.find((item) => item.value === pool)?.label;
};