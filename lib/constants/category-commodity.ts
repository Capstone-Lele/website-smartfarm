export const COMMODITY_CATEGORY = [
  { value: "harvest", label: "Panen" },
  { value: "sale", label: "Penjualan" },
];

export const TranslationCommodityCategory = (category: string) => {
  const found = COMMODITY_CATEGORY.find((cat) => cat.value === category);
  return found ? found.label : category;
};