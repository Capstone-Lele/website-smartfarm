export interface PoolDimensions {
  height?: number | string | null;
  diameter?: number | string | null;
  length?: number | string | null;
  width?: number | string | null;
}

export const calculatePoolVolume = ({
  height,
  diameter,
  length,
  width,
}: PoolDimensions): number => {
  const nF = (value: any) => Number(value) || 0;
  const h = nF(height);

  if (!h) return 0;

  if (diameter) {
    const d = nF(diameter);
    return Math.PI * Math.pow(d / 2, 2) * h;
  } else if (length && width) {
    const l = nF(length);
    const w = nF(width);
    return l * w * h;
  }

  return 0;
};
