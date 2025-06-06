import { processRestaurants } from "./restaurantUtils";
import type { Restaurant } from "../types/Restaurant";
import type { RestaurantFilterStrategy } from "../strategies/filter/RestaurantFilterStrategy";
import type { SortStrategy } from "../strategies/sort/RestaurantSortStrategy";

describe("restaurantUtils", () => {
  const mockRestaurants: Restaurant[] = [
    {
      id: "1",
      name: "Pizza Place",
      rating: { starRating: 4.5, count: 100 },
      cuisines: [{ name: "Italian" }],
      deliveryEtaMinutes: { rangeLower: 30, rangeUpper: 45 },
      deliveryCost: 2.99,
      minimumDeliveryValue: 15.0,
    },
    {
      id: "2",
      name: "Burger Joint",
      rating: { starRating: 4.2, count: 200 },
      cuisines: [{ name: "American" }],
      deliveryEtaMinutes: { rangeLower: 20, rangeUpper: 35 },
      deliveryCost: 1.99,
      minimumDeliveryValue: 10.0,
    },
    {
      id: "3",
      name: "Sushi Bar",
      rating: { starRating: 4.8, count: 150 },
      cuisines: [{ name: "Japanese" }],
      deliveryEtaMinutes: { rangeLower: 40, rangeUpper: 55 },
      deliveryCost: 3.99,
      minimumDeliveryValue: 20.0,
    },
  ];

  describe("processRestaurants", () => {
    test("applies single filter strategy", () => {
      const mockFilter: RestaurantFilterStrategy = {
        apply: jest.fn().mockReturnValue([mockRestaurants[0]]),
      };

      const mockSort: SortStrategy = {
        sort: jest.fn().mockReturnValue([mockRestaurants[0]]),
      };

      const result = processRestaurants(
        mockRestaurants,
        [mockFilter],
        mockSort
      );

      expect(mockFilter.apply).toHaveBeenCalledWith(mockRestaurants);
      expect(mockSort.sort).toHaveBeenCalledWith([mockRestaurants[0]]);
      expect(result).toEqual([mockRestaurants[0]]);
    });

    test("applies multiple filter strategies in sequence", () => {
      const firstFilter: RestaurantFilterStrategy = {
        apply: jest
          .fn()
          .mockReturnValue([mockRestaurants[0], mockRestaurants[1]]),
      };

      const secondFilter: RestaurantFilterStrategy = {
        apply: jest.fn().mockReturnValue([mockRestaurants[0]]),
      };

      const mockSort: SortStrategy = {
        sort: jest.fn().mockReturnValue([mockRestaurants[0]]),
      };

      const result = processRestaurants(
        mockRestaurants,
        [firstFilter, secondFilter],
        mockSort
      );

      expect(firstFilter.apply).toHaveBeenCalledWith(mockRestaurants);
      expect(secondFilter.apply).toHaveBeenCalledWith([
        mockRestaurants[0],
        mockRestaurants[1],
      ]);
      expect(mockSort.sort).toHaveBeenCalledWith([mockRestaurants[0]]);
      expect(result).toEqual([mockRestaurants[0]]);
    });

    test("applies sort strategy after filtering", () => {
      const filteredRestaurants = [mockRestaurants[1], mockRestaurants[0]];
      const sortedRestaurants = [mockRestaurants[0], mockRestaurants[1]];

      const mockFilter: RestaurantFilterStrategy = {
        apply: jest.fn().mockReturnValue(filteredRestaurants),
      };

      const mockSort: SortStrategy = {
        sort: jest.fn().mockReturnValue(sortedRestaurants),
      };

      const result = processRestaurants(
        mockRestaurants,
        [mockFilter],
        mockSort
      );

      expect(mockFilter.apply).toHaveBeenCalledWith(mockRestaurants);
      expect(mockSort.sort).toHaveBeenCalledWith(filteredRestaurants);
      expect(result).toEqual(sortedRestaurants);
    });

    test("handles empty filter strategies array", () => {
      const mockSort: SortStrategy = {
        sort: jest.fn().mockReturnValue(mockRestaurants),
      };

      const result = processRestaurants(mockRestaurants, [], mockSort);

      expect(mockSort.sort).toHaveBeenCalledWith(mockRestaurants);
      expect(result).toEqual(mockRestaurants);
    });

    test("handles empty restaurants array", () => {
      const mockFilter: RestaurantFilterStrategy = {
        apply: jest.fn().mockReturnValue([]),
      };

      const mockSort: SortStrategy = {
        sort: jest.fn().mockReturnValue([]),
      };

      const result = processRestaurants([], [mockFilter], mockSort);

      expect(mockFilter.apply).toHaveBeenCalledWith([]);
      expect(mockSort.sort).toHaveBeenCalledWith([]);
      expect(result).toEqual([]);
    });

    test("preserves original array immutability", () => {
      const originalRestaurants = [...mockRestaurants];

      const mockFilter: RestaurantFilterStrategy = {
        apply: jest.fn().mockImplementation((restaurants) => {
          restaurants.pop(); // Mutate the array passed to filter
          return restaurants;
        }),
      };

      const mockSort: SortStrategy = {
        sort: jest.fn().mockImplementation((restaurants) => {
          restaurants.reverse(); // Mutate the array passed to sort
          return restaurants;
        }),
      };

      processRestaurants(mockRestaurants, [mockFilter], mockSort);

      // Original array should remain unchanged
      expect(mockRestaurants).toEqual(originalRestaurants);
    });

    test("handles filter that returns empty array", () => {
      const mockFilter: RestaurantFilterStrategy = {
        apply: jest.fn().mockReturnValue([]),
      };

      const mockSort: SortStrategy = {
        sort: jest.fn().mockReturnValue([]),
      };

      const result = processRestaurants(
        mockRestaurants,
        [mockFilter],
        mockSort
      );

      expect(mockFilter.apply).toHaveBeenCalledWith(mockRestaurants);
      expect(mockSort.sort).toHaveBeenCalledWith([]);
      expect(result).toEqual([]);
    });

    test("filters are applied in correct order", () => {
      const callOrder: string[] = [];

      const firstFilter: RestaurantFilterStrategy = {
        apply: jest.fn().mockImplementation((restaurants) => {
          callOrder.push("filter1");
          return restaurants.slice(0, 2);
        }),
      };

      const secondFilter: RestaurantFilterStrategy = {
        apply: jest.fn().mockImplementation((restaurants) => {
          callOrder.push("filter2");
          return restaurants.slice(0, 1);
        }),
      };

      const mockSort: SortStrategy = {
        sort: jest.fn().mockImplementation((restaurants) => {
          callOrder.push("sort");
          return restaurants;
        }),
      };

      processRestaurants(
        mockRestaurants,
        [firstFilter, secondFilter],
        mockSort
      );

      expect(callOrder).toEqual(["filter1", "filter2", "sort"]);
    });

    test("handles complex filtering and sorting scenario", () => {
      // Filter for Italian restaurants only
      const italianFilter: RestaurantFilterStrategy = {
        apply: jest
          .fn()
          .mockImplementation((restaurants: Restaurant[]) =>
            restaurants.filter((r) =>
              r.cuisines?.some((c) => c.name === "Italian")
            )
          ),
      };

      // Sort by rating descending
      const ratingSort: SortStrategy = {
        sort: jest
          .fn()
          .mockImplementation((restaurants) =>
            [...restaurants].sort(
              (a, b) =>
                (b.rating?.starRating || 0) - (a.rating?.starRating || 0)
            )
          ),
      };

      const result = processRestaurants(
        mockRestaurants,
        [italianFilter],
        ratingSort
      );

      expect(italianFilter.apply).toHaveBeenCalledWith(mockRestaurants);
      expect(ratingSort.sort).toHaveBeenCalledWith([mockRestaurants[0]]); // Only Pizza Place (Italian)
      expect(result).toEqual([mockRestaurants[0]]);
    });
  });
});
