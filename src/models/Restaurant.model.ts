export interface Restaurant {
  id: string;
  name: string;
  address: {
    firstLine: string;
    city: string;
    postalCode: string;
  };
  rating: {
    starRating: number;
    count: number;
  };
  cuisines: Array<{ name: string }>;
  deliveryEtaMinutes: {
    rangeLower: number;
    rangeUpper: number;
  };
  deliveryCost: number;
}
