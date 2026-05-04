export type IOTData = {
  node_id: number;
  ph: number;
  temp: number;
  timestamp: number;
  receivedAt: string;
};

export type ResponseIOTData = {
  success: boolean;
  message: string;
  data: IOTData[];
};

export type IOTDataHistorical = {
  node_id: number;
  ph: number;
  temp: number;
  createdAt: string;
};

export type ResponseIOTDataHistorical = {
  success: boolean;
  message: string;
  data: IOTDataHistorical[];
};

export type IOTDataLiveDetail = {
  success: boolean;
  message: string;
  data: {
    node_id: number;
    ph: number;
    temp: number;
    timestamp: number;
    receivedAt: string;
  };
};
