import type { Restaurant } from "../types/Restaurant";
import type { RestaurantFilterStrategy } from "../strategies/filter/RestaurantFilterStrategy";
import type { SortStrategy } from "../strategies/sort/RestaurantSortStrategy";

/**
 * Processes a list of restaurants by applying filter strategies sequentially,
 * followed by a sort strategy.
 *
 * @param restaurants - The array of restaurants to process
 * @param filterStrategies - Array of filter strategies to apply in sequence
 * @param sortStrategy - The sort strategy to apply after filtering
 * @returns The filtered and sorted array of restaurants
 */
export function processRestaurants(
  restaurants: Restaurant[],
  filterStrategies: RestaurantFilterStrategy[],
  sortStrategy: SortStrategy
): Restaurant[] {
  let processedRestaurants = restaurants;

  for (const filterStrategy of filterStrategies) {
    processedRestaurants = filterStrategy.apply(processedRestaurants);
  }

  return sortStrategy.sort(processedRestaurants);
}
