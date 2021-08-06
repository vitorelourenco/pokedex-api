export function drawInteger(min?: number, max?: number) {
  if (max < min) throw new Error("expects (min, max) params");

  const closedCeiling = max ?? 1;
  const closedFloor = min ?? 0;
  const randomNum = Math.random(); //x in [0,1[ ^ x ∈ ℝ
  const numInRange =
    closedFloor + randomNum * (closedCeiling + 1 - closedFloor);
  return Math.floor(numInRange);
}
