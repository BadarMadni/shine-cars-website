interface ConfirmBookingParams {
  result: { distance: number; fare: number };
  pickup: { address: string; lat: number; lng: number };
  dropoff: { address: string; lat: number; lng: number };
  stops?: string[];
  name: string;
  phone: string;
  date: string;
  time: string;
  vehicle: string;
  paymentMethod: "cash" | "card";
  fareType: "fixed" | "meter";
}

/**
 * Submits a booking. For card payments, redirects to Stripe checkout.
 * For cash, posts directly to /api/bookings.
 * Returns true when booking is complete (cash), false when redirecting (card).
 */
export async function confirmBooking(params: ConfirmBookingParams): Promise<boolean> {
  const { result, pickup, dropoff, stops, name, phone, date, time, vehicle, paymentMethod, fareType } = params;

  try {
    if (paymentMethod === "card") {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, phone, pickup: pickup.address, dropoff: dropoff.address, stops,
          date, time, distance: result.distance, fare: result.fare, vehicle, fareType, source: "homepage",
        }),
      });
      const data = await res.json();
      if (data.url) { window.location.href = data.url; }
      return false;
    }
    await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name, phone, pickup: pickup.address, dropoff: dropoff.address, stops,
        date, time, distance: result.distance, fare: result.fare, vehicle,
        paymentMethod: "cash", fareType, source: "homepage",
      }),
    });
    return true;
  } catch {
    return false;
  }
}
