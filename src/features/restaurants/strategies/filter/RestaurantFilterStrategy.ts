import type { Restaurant } from "../../types/Restaurant";

export interface RestaurantFilterStrategy {
  apply(data: Restaurant[]): Restaurant[];
}

export class FilterBySearchQuery implements RestaurantFilterStrategy {
  private searchQuery: string;

  constructor(searchQuery: string) {
    this.searchQuery = searchQuery;
  }

  apply(data: Restaurant[]): Restaurant[] {
    if (!this.searchQuery || !this.searchQuery.trim()) {
      return data;
    }

    const query = this.searchQuery.trim().toLowerCase();

    return data.filter(
      (restaurant) =>
        restaurant.name?.toLowerCase().includes(query) ||
        restaurant.cuisines?.some((cuisine) =>
          cuisine.name.toLowerCase().includes(query)
        )
    );
  }
}

export class FilterByOpenNow implements RestaurantFilterStrategy {
  apply(data: Restaurant[]): Restaurant[] {
    return data.filter(
      (restaurant) => restaurant.isOpenNowForDelivery === true
    );
  }
}

export class FilterByNew implements RestaurantFilterStrategy {
  apply(data: Restaurant[]): Restaurant[] {
    return data.filter((restaurant) => restaurant.isNew === true);
  }
}

export class FilterByFreeDelivery implements RestaurantFilterStrategy {
  apply(data: Restaurant[]): Restaurant[] {
    return data.filter((restaurant) => restaurant.deliveryCost === 0);
  }
}

export interface RestaurantFilterOptions {
  query?: string;
  openNow?: boolean;
  isNew?: boolean;
  freeDelivery?: boolean;
}

export class RestaurantFilterRegistry {
  getStrategies(options: RestaurantFilterOptions): RestaurantFilterStrategy[] {
    const strategies: RestaurantFilterStrategy[] = [];

    // Add search query filter if query is provided and not empty
    if (options.query && options.query.trim()) {
      strategies.push(new FilterBySearchQuery(options.query));
    }

    // Add open now filter if enabled
    if (options.openNow) {
      strategies.push(new FilterByOpenNow());
    }

    // Add new restaurant filter if enabled
    if (options.isNew) {
      strategies.push(new FilterByNew());
    }

    // Add free delivery filter if enabled
    if (options.freeDelivery) {
      strategies.push(new FilterByFreeDelivery());
    }

    return strategies;
  }
}
