import { Feed } from "@/types/notes/feed.types";

export interface FeedTrendData {
  bulan: string;
  biomass: number;
  details?: {
    totalKg: number;
    count: number;
  };
}

/**
 * Transform feed data into monthly trend data for chart visualization
 * @param feedData Array of feed records
 * @param monthsBack Number of months to include (default: 6)
 * @returns Array of monthly feed trend data
 */
export const transformFeedToTrendData = (
  feedData: Feed[],
  monthsBack: number = 6,
): FeedTrendData[] => {
  const now = new Date();
  const months: FeedTrendData[] = [];

  // Generate months array
  for (let i = monthsBack - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = date.toLocaleDateString("id-ID", {
      month: "short",
    });
    months.push({
      bulan: monthName,
      biomass: 0,
      details: {
        totalKg: 0,
        count: 0,
      },
    });
  }

  // Aggregate feed data by month
  if (!feedData || feedData.length === 0) {
    return months;
  }

  feedData.forEach((feed) => {
    const feedDate = new Date(feed.reportDate);
    const currentDate = new Date();

    // Calculate month difference
    const monthDiff =
      currentDate.getMonth() -
      feedDate.getMonth() +
      (currentDate.getFullYear() - feedDate.getFullYear()) * 12;

    // Only include data within the monthsBack range
    if (monthDiff >= 0 && monthDiff < monthsBack) {
      const index = monthsBack - 1 - monthDiff;
      const quantity = parseFloat(feed.quantity) || 0;

      months[index].biomass += quantity;
      if (months[index].details) {
        months[index].details.totalKg += quantity;
        months[index].details.count += 1;
      }
    }
  });

  return months;
};

/**
 * Get last N months names for labels
 */
export const getMonthLabels = (count: number = 6): string[] => {
  const labels: string[] = [];
  const now = new Date();

  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(
      date.toLocaleDateString("id-ID", {
        month: "short",
      }),
    );
  }

  return labels;
};
