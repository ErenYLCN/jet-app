export const RESTAURANT_SORT_OPTIONS = [
  "bestMatch",
  "reviews",
  "estimatedDeliveryTime",
  "minOrderAmount",
  "deliveryCost",
] as const;

export type RestaurantSortOption = (typeof RESTAURANT_SORT_OPTIONS)[number];

import type { Restaurant } from "../../types/Restaurant";

export interface SortStrategy {
  sort(restaurants: Restaurant[]): Restaurant[];
}

export class SortByBestMatch implements SortStrategy {
  sort(restaurants: Restaurant[]): Restaurant[] {
    return restaurants;
  }
}

export class SortByReviews implements SortStrategy {
  sort(restaurants: Restaurant[]): Restaurant[] {
    return [...restaurants].sort((a, b) => {
      const ratingA = a.rating?.starRating ?? 0;
      const ratingB = b.rating?.starRating ?? 0;
      return ratingB - ratingA;
    });
  }
}

export class SortByEstimatedDeliveryTime implements SortStrategy {
  sort(restaurants: Restaurant[]): Restaurant[] {
    return [...restaurants].sort((a, b) => {
      const etaA = a.deliveryEtaMinutes?.rangeLower ?? Infinity;
      const etaB = b.deliveryEtaMinutes?.rangeLower ?? Infinity;
      return etaA - etaB;
    });
  }
}

export class SortByMinOrderAmount implements SortStrategy {
  sort(restaurants: Restaurant[]): Restaurant[] {
    return [...restaurants].sort((a, b) => {
      const minA = a.minimumDeliveryValue ?? 0;
      const minB = b.minimumDeliveryValue ?? 0;
      return minA - minB;
    });
  }
}

export class SortByDeliveryCost implements SortStrategy {
  sort(restaurants: Restaurant[]): Restaurant[] {
    return [...restaurants].sort((a, b) => {
      const costA = a.deliveryCost ?? 0;
      const costB = b.deliveryCost ?? 0;
      return costA - costB;
    });
  }
}

export class RestaurantSortStrategyRegistry {
  private strategies: Record<RestaurantSortOption, SortStrategy>;

  constructor() {
    this.strategies = {
      bestMatch: new SortByBestMatch(),
      reviews: new SortByReviews(),
      estimatedDeliveryTime: new SortByEstimatedDeliveryTime(),
      minOrderAmount: new SortByMinOrderAmount(),
      deliveryCost: new SortByDeliveryCost(),
    };
  }

  getStrategy(option: RestaurantSortOption): SortStrategy {
    return this.strategies[option] || new SortByBestMatch();
  }
}
