export type DashboardType = {
  totalPool: number;
  totalSeed: number;
  totalStaff: number;
  totalHarvestQuantity: number | null;
  totalFood: number;
  survivalRate: number;
  fishPopulation: {
    current: number;
    mortality: number;
    quarantine: number;
  };
};

export type DashboardResponse = {
  success: boolean;
  message: string;
  data: DashboardType[];
};
