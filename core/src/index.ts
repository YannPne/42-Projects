export * from "./Event";

export function nextPow(n: number) {
  if (n <= 2)
    return 2;

  let pow = 1;
  while (pow < n)
    pow <<= 1;

  return pow;
}