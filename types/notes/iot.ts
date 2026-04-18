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
