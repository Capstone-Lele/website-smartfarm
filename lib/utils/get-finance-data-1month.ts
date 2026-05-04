export const calculateFinanceSummary = (
  commodityData?: any[],
  inventoryData?: any[],
  inventorySubmissionData?: any[],
  nonInventoryData?: any[],
) => {
  let income = 0;
  let expense = 0;
  const currDate = new Date();
  const firstDayOfMonth = new Date(
    currDate.getFullYear(),
    currDate.getMonth(),
    1,
  ).getTime();
  const lastDayOfMonth = new Date(
    currDate.getFullYear(),
    currDate.getMonth() + 1,
    0,
    23,
    59,
    59,
    999,
  ).getTime();

  const processData = (arr: any[]) => {
    if (!arr) return;
    arr.forEach((item) => {
      const time = new Date(item.transactionDate).getTime();
      if (time >= firstDayOfMonth && time <= lastDayOfMonth) {
        if (item.transactionType === "grant") return; // exclude hibah/pendanaan
        if (item.type === "in") {
          income += Number(item.totalPrice) || 0;
        } else if (item.type === "out") {
          expense += Number(item.totalPrice) || 0;
        }
      }
    });
  };

  processData(commodityData || []);
  processData(inventoryData || []);
  processData(inventorySubmissionData || []);
  processData(nonInventoryData || []);

  return {
    totalIncome: income,
    totalExpense: expense,
    netProfit: income - expense,
  };
};
