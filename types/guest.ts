export type LatestHarvest = {
  id: string;
  poolName: string;
  reportDate: string;
  totalQuantity: number;
};

export type ChartHarvest = {
  month: string; // e.g., "January", "February", etc.
  total: number; // Total harvest quantity for that month
  frequency: number; // Number of harvest events in that month
};

export type ChartPopulation = {
  poolName: string; // Name of the pool eg "Kolam 1", "Kolam 2", etc.
  total: number; // Total average fish population for that pool
};

export type HarvestSection = {
  totalHarvestQty: number;
  latestHarvest: LatestHarvest[];
  chartHarvest: ChartHarvest[];
};

export type PopulationSection = {
  totalExistingFishPopulation: number;
  totalAverageFishPopulation: number;
  chartPopulation: ChartPopulation[];
};

export type PoolSection = {
  totalBreedingPools: number;
  totalGrowingPools: number;
  totalQuarantinePools: number;
};

export type GeneralInfoData = {
  totalPools: number;
  totalExistingTransaction: number;
  totalSuccessHarvest: number;
  poolSection: PoolSection;
  populationSection: PopulationSection;
  harvestSection: HarvestSection;
};

export type GeneralInfoResponse = {
  success: boolean;
  message: string;
  data: GeneralInfoData[];
};
