/**
 * Shine Cars fare calculator
 * - Base fare: £5 (covers first 1.5 miles)
 * - 1.5 to 10 miles: £2.30 per mile
 * - Over 10 miles: £1.80 per mile
 */
export function calculateFare(distanceMiles: number): number {
  if (distanceMiles <= 0) return 0;

  const BASE_FARE = 5;
  const BASE_MILES = 1.5;
  const MID_RATE = 2.3;
  const MID_LIMIT = 10;
  const HIGH_RATE = 1.8;

  if (distanceMiles <= BASE_MILES) {
    return BASE_FARE;
  }

  if (distanceMiles <= MID_LIMIT) {
    return BASE_FARE + (distanceMiles - BASE_MILES) * MID_RATE;
  }

  const midCharge = (MID_LIMIT - BASE_MILES) * MID_RATE;
  const highCharge = (distanceMiles - MID_LIMIT) * HIGH_RATE;
  return BASE_FARE + midCharge + highCharge;
}

export function metersToMiles(meters: number): number {
  return meters * 0.000621371;
}
