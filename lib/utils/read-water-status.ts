export function getWaterStatus(
  currentValue: number,
  minArr: number[],
  maxArr: number[],
  normalArr: number[],
): "normal" | "warning" | "danger" | "unknown" | "invalid-parameter" {

  if (isNaN(currentValue)) {
    return "unknown";
  }

  if ( !Array.isArray(minArr) || !Array.isArray(maxArr) || !Array.isArray(normalArr)) {
    return "invalid-parameter";
  }

  const minLow = minArr[0];
  const minHigh = minArr[1];
  const maxLow = maxArr[0];
  const maxHigh = maxArr[1];
  const normalMin = normalArr[0];
  const normalMax = normalArr[1];

  if ((currentValue >= minLow && currentValue <= minHigh) || (currentValue >= maxLow && currentValue <= maxHigh)) {
    return "warning";
  }
  if (currentValue >= normalMin && currentValue <= normalMax) {
    return "normal";
  }
  return "danger";
}
