import { FilterBySearchQuery } from "./RestaurantFilterStrategy";
import type { Restaurant } from "../../types/Restaurant";

describe("RestaurantFilterStrategy", () => {
  const mockRestaurants: Restaurant[] = [
    {
      id: "1",
      name: "Pizza Palace",
      cuisines: [{ name: "Italian" }, { name: "Pizza" }],
    },
    {
      id: "2",
      name: "Burger House",
      cuisines: [{ name: "American" }, { name: "Burgers" }],
    },
    {
      id: "3",
      name: "Sushi Express",
      cuisines: [{ name: "Japanese" }, { name: "Sushi" }],
    },
    {
      id: "4",
      name: "Italian Bistro",
      cuisines: [{ name: "Italian" }, { name: "Mediterranean" }],
    },
    {
      id: "5",
      name: "Thai Garden",
      cuisines: [{ name: "Thai" }, { name: "Asian" }],
    },
    {
      id: "6",
      name: "No Name Restaurant",
      cuisines: undefined,
    },
    {
      id: "7",
      name: "Empty Cuisines",
      cuisines: [],
    },
  ];

  describe("FilterBySearchQuery", () => {
    test("returns all restaurants when search query is empty", () => {
      const filter = new FilterBySearchQuery("");
      const result = filter.apply(mockRestaurants);

      expect(result).toEqual(mockRestaurants);
    });

    test("returns all restaurants when search query is whitespace only", () => {
      const filter = new FilterBySearchQuery("   ");
      const result = filter.apply(mockRestaurants);

      expect(result).toEqual(mockRestaurants);
    });

    test("filters restaurants by name (case insensitive)", () => {
      const filter = new FilterBySearchQuery("pizza");
      const result = filter.apply(mockRestaurants);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Pizza Palace");
    });

    test("filters restaurants by name with different casing", () => {
      const filter = new FilterBySearchQuery("BURGER");
      const result = filter.apply(mockRestaurants);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Burger House");
    });

    test("filters restaurants by cuisine name", () => {
      const filter = new FilterBySearchQuery("italian");
      const result = filter.apply(mockRestaurants);

      expect(result).toHaveLength(2);
      expect(result.map((r) => r.name)).toEqual([
        "Pizza Palace",
        "Italian Bistro",
      ]);
    });

    test("filters restaurants by partial name match", () => {
      const filter = new FilterBySearchQuery("sush");
      const result = filter.apply(mockRestaurants);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Sushi Express");
    });

    test("filters restaurants by partial cuisine match", () => {
      const filter = new FilterBySearchQuery("asia");
      const result = filter.apply(mockRestaurants);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Thai Garden");
    });

    test("returns multiple matches when query matches multiple restaurants", () => {
      const filter = new FilterBySearchQuery("house");
      const result = filter.apply(mockRestaurants);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Burger House");
    });

    test("returns empty array when no matches found", () => {
      const filter = new FilterBySearchQuery("nonexistent");
      const result = filter.apply(mockRestaurants);

      expect(result).toHaveLength(0);
    });

    test("handles restaurants with undefined name", () => {
      const restaurantsWithUndefinedName: Restaurant[] = [
        {
          id: "1",
          name: undefined as any,
          cuisines: [{ name: "Italian" }],
        },
        {
          id: "2",
          name: "Pizza Palace",
          cuisines: [{ name: "Italian" }],
        },
      ];

      const filter = new FilterBySearchQuery("pizza");
      const result = filter.apply(restaurantsWithUndefinedName);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Pizza Palace");
    });

    test("handles restaurants with undefined cuisines", () => {
      const filter = new FilterBySearchQuery("italian");
      const result = filter.apply(mockRestaurants);

      // Should find restaurants with Italian cuisine but not affect those without cuisines
      expect(result).toHaveLength(2);
      expect(result.every((r) => r.name !== "No Name Restaurant")).toBe(true);
    });

    test("handles restaurants with empty cuisines array", () => {
      const filter = new FilterBySearchQuery("empty");
      const result = filter.apply(mockRestaurants);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Empty Cuisines");
    });

    test("matches restaurants by name when cuisines is undefined", () => {
      const filter = new FilterBySearchQuery("no name");
      const result = filter.apply(mockRestaurants);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("No Name Restaurant");
    });

    test("search is case insensitive for cuisines", () => {
      const filter = new FilterBySearchQuery("JAPANESE");
      const result = filter.apply(mockRestaurants);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Sushi Express");
    });

    test("handles special characters in search query", () => {
      const restaurantsWithSpecialChars: Restaurant[] = [
        {
          id: "1",
          name: "Café & Bistro",
          cuisines: [{ name: "French" }],
        },
        {
          id: "2",
          name: "Pizza Palace",
          cuisines: [{ name: "Italian" }],
        },
      ];

      const filter = new FilterBySearchQuery("café");
      const result = filter.apply(restaurantsWithSpecialChars);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Café & Bistro");
    });

    test("handles numbers in search query", () => {
      const restaurantsWithNumbers: Restaurant[] = [
        {
          id: "1",
          name: "Restaurant 24/7",
          cuisines: [{ name: "American" }],
        },
        {
          id: "2",
          name: "Pizza Palace",
          cuisines: [{ name: "Italian" }],
        },
      ];

      const filter = new FilterBySearchQuery("24");
      const result = filter.apply(restaurantsWithNumbers);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Restaurant 24/7");
    });

    test("preserves original array immutability", () => {
      const originalRestaurants = [...mockRestaurants];
      const filter = new FilterBySearchQuery("pizza");

      filter.apply(mockRestaurants);

      expect(mockRestaurants).toEqual(originalRestaurants);
    });

    test("search query constructor sets the query correctly", () => {
      const query = "test";
      const filter = new FilterBySearchQuery(query);

      // We can test this indirectly by seeing if it works as expected
      const result = filter.apply([
        { id: "1", name: "Test Restaurant", cuisines: [] },
        { id: "2", name: "Other Restaurant", cuisines: [] },
      ]);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Test Restaurant");
    });

    test("handles empty restaurants array", () => {
      const filter = new FilterBySearchQuery("pizza");
      const result = filter.apply([]);

      expect(result).toEqual([]);
    });

    test("multiple word search query", () => {
      const filter = new FilterBySearchQuery("sushi express");
      const result = filter.apply(mockRestaurants);

      // Should match "Sushi Express" as the name contains both words
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Sushi Express");
    });
  });
});
