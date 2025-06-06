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
