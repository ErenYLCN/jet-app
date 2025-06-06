import {
  RestaurantSortStrategyRegistry,
  SortByBestMatch,
  SortByReviews,
  SortByEstimatedDeliveryTime,
  SortByMinOrderAmount,
  SortByDeliveryCost,
  type RestaurantSortOption,
} from "./RestaurantSortStrategy";
import type { Restaurant } from "../../types/Restaurant";

describe("Restaurant Sort Strategies", () => {
  const mockRestaurants: Restaurant[] = [
    {
      id: "1",
      name: "Restaurant A",
      rating: { starRating: 4.5 },
      deliveryEtaMinutes: { rangeLower: 30, rangeUpper: 45 },
      minimumDeliveryValue: 15,
      deliveryCost: 5,
    },
    {
      id: "2",
      name: "Restaurant B",
      rating: { starRating: 3.8 },
      deliveryEtaMinutes: { rangeLower: 20, rangeUpper: 35 },
      minimumDeliveryValue: 10,
      deliveryCost: 3.5,
    },
    {
      id: "3",
      name: "Restaurant C",
      rating: { starRating: 4.9 },
      deliveryEtaMinutes: { rangeLower: 40, rangeUpper: 55 },
      minimumDeliveryValue: 20,
      deliveryCost: 0,
    },
    {
      id: "4",
      name: "Restaurant D",
      rating: undefined,
      deliveryEtaMinutes: undefined,
      minimumDeliveryValue: undefined,
      deliveryCost: undefined,
    },
  ];

  describe("SortByBestMatch", () => {
    test("should return the restaurants in their original order", () => {
      const strategy = new SortByBestMatch();
      const result = strategy.sort([...mockRestaurants]);

      expect(result).toEqual(mockRestaurants);
    });
  });

  describe("SortByReviews", () => {
    test("should sort restaurants by star rating in descending order", () => {
      const strategy = new SortByReviews();
      const result = strategy.sort([...mockRestaurants]);

      expect(result[0].id).toBe("3");
      expect(result[1].id).toBe("1");
      expect(result[2].id).toBe("2");
      expect(result[3].id).toBe("4");
    });
  });

  describe("SortByEstimatedDeliveryTime", () => {
    test("should sort restaurants by lowest delivery time", () => {
      const strategy = new SortByEstimatedDeliveryTime();
      const result = strategy.sort([...mockRestaurants]);

      expect(result[0].id).toBe("2");
      expect(result[1].id).toBe("1");
      expect(result[2].id).toBe("3");
      expect(result[3].id).toBe("4");
    });
  });

  describe("SortByMinOrderAmount", () => {
    test("should sort restaurants by minimum order amount in ascending order", () => {
      const strategy = new SortByMinOrderAmount();
      const result = strategy.sort([...mockRestaurants]);

      expect(result[0].id).toBe("4");
      expect(result[1].id).toBe("2");
      expect(result[2].id).toBe("1");
      expect(result[3].id).toBe("3");
    });
  });

  describe("SortByDeliveryCost", () => {
    test("should sort restaurants by delivery cost in ascending order", () => {
      const strategy = new SortByDeliveryCost();
      const result = strategy.sort([...mockRestaurants]);

      expect(result[0].id === "3" || result[0].id === "4").toBeTruthy();
      expect(result[1].id === "3" || result[1].id === "4").toBeTruthy();
      expect(result[2].id).toBe("2");
      expect(result[3].id).toBe("1");
    });
  });

  describe("RestaurantSortStrategyRegistry", () => {
    test("should return the correct strategy for each sort option", () => {
      const registry = new RestaurantSortStrategyRegistry();

      const options: RestaurantSortOption[] = [
        "bestMatch",
        "reviews",
        "estimatedDeliveryTime",
        "minOrderAmount",
        "deliveryCost",
      ];

      expect(registry.getStrategy(options[0])).toBeInstanceOf(SortByBestMatch);
      expect(registry.getStrategy(options[1])).toBeInstanceOf(SortByReviews);
      expect(registry.getStrategy(options[2])).toBeInstanceOf(
        SortByEstimatedDeliveryTime
      );
      expect(registry.getStrategy(options[3])).toBeInstanceOf(
        SortByMinOrderAmount
      );
      expect(registry.getStrategy(options[4])).toBeInstanceOf(
        SortByDeliveryCost
      );
    });

    test("should return SortByBestMatch for invalid option", () => {
      const registry = new RestaurantSortStrategyRegistry();
      // @ts-expect-error Testing with invalid option
      const strategy = registry.getStrategy("invalidOption");

      expect(strategy).toBeInstanceOf(SortByBestMatch);
    });
  });
});
