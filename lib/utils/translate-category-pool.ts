import { POOLS_CATEGORY } from "../constants/category";

export const translateCategoryPool = (category: string) => {
  if (!category) return "-";
  const categoryName = POOLS_CATEGORY.find((cat) => cat.value === category);
  return categoryName ? categoryName.label : category;
};
