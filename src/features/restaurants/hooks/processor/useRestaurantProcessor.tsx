import { useMemo } from "react";
import { useAppSelector } from "../../../../store/hooks";
import { useRestaurantListState } from "../list-state/useRestaurantListState";
import { processRestaurants } from "../../utils/restaurantUtils";
import { RestaurantFilterRegistry } from "../../strategies/filter/RestaurantFilterStrategy";
import { RestaurantSortStrategyRegistry } from "../../strategies/sort/RestaurantSortStrategy";

export const useRestaurantProcessor = () => {
  const { restaurants, loading, error } = useAppSelector(
    (state) => state.restaurants
  );

  const { searchQuery, sort, openNow, isNew, freeDelivery } =
    useRestaurantListState();

  const sortRegistry = useMemo(() => new RestaurantSortStrategyRegistry(), []);
  const filterRegistry = useMemo(() => new RestaurantFilterRegistry(), []);

  const filterStrategies = useMemo(
    () =>
      filterRegistry.getStrategies({
        query: searchQuery,
        openNow,
        isNew,
        freeDelivery,
      }),
    [filterRegistry, searchQuery, openNow, isNew, freeDelivery]
  );

  const sortStrategy = useMemo(
    () => sortRegistry.getStrategy(sort),
    [sortRegistry, sort]
  );

  const processedRestaurants = useMemo(
    () => processRestaurants(restaurants, filterStrategies, sortStrategy),
    [restaurants, filterStrategies, sortStrategy]
  );

  return {
    restaurants,
    loading,
    error,
    processedRestaurants,
    searchQuery,
    hasActiveFilters: !!(searchQuery || openNow || isNew || freeDelivery),
    totalRestaurants: restaurants.length,
    filteredCount: processedRestaurants.length,
  };
};
