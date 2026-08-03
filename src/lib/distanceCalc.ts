import { metersToMiles } from "@/lib/fare";

interface Point { lat: number; lng: number }

export function calcMultiSegmentDistance(
  points: Point[],
  onResult: (miles: number) => void,
  onError: () => void,
) {
  const service = new google.maps.DistanceMatrixService();
  let totalMeters = 0;
  let completed = 0;
  const segments = points.length - 1;
  if (segments <= 0) { onError(); return; }

  for (let i = 0; i < segments; i++) {
    service.getDistanceMatrix(
      {
        origins: [points[i]],
        destinations: [points[i + 1]],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.IMPERIAL,
      },
      (response, status) => {
        if (status === "OK" && response?.rows[0]?.elements[0]?.distance) {
          totalMeters += response.rows[0].elements[0].distance.value;
        }
        completed++;
        if (completed === segments) {
          if (totalMeters === 0) { onError(); return; }
          onResult(metersToMiles(totalMeters));
        }
      }
    );
  }
}
