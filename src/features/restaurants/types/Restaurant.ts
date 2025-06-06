export interface Restaurant {
  id: string;
  name?: string;
  address?: {
    firstLine?: string;
    city?: string;
    postalCode?: string;
    location?: {
      type: "Point";
      coordinates: [number, number]; // [longitude, latitude]
    };
  };
  rating?: {
    starRating?: number;
    count?: number;
  };
  cuisines?: Array<{ name: string }>;
  deliveryEtaMinutes?: {
    rangeLower?: number;
    rangeUpper?: number;
  };
  deliveryCost?: number;
  logoUrl?: string;
  minimumDeliveryValue?: number;
  isOpenNowForDelivery?: boolean;
  isNew?: boolean;
}
