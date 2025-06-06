import { renderHook, act } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { useRestaurantListState } from "./useRestaurantListState";

const createWrapper = (initialEntries: string[] = ["/"]) => {
  return ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
  );
};

describe("useRestaurantListState", () => {
  test("initializes with default values", () => {
    const { result } = renderHook(() => useRestaurantListState(), {
      wrapper: createWrapper(),
    });

    expect(result.current.searchQuery).toBe("");
    expect(result.current.page).toBe(1);
    expect(result.current.sort).toBe("bestMatch");
  });

  test("reads values from URL parameters", () => {
    const { result } = renderHook(() => useRestaurantListState(), {
      wrapper: createWrapper(["/?q=pizza&page=2&sort=reviews"]),
    });

    expect(result.current.searchQuery).toBe("pizza");
    expect(result.current.page).toBe(2);
    expect(result.current.sort).toBe("reviews");
  });

  test("sets search query and resets page", () => {
    const { result } = renderHook(() => useRestaurantListState(), {
      wrapper: createWrapper(["/?page=3&sort=reviews"]),
    });

    act(() => {
      result.current.setSearchQuery("burgers");
    });

    expect(result.current.searchQuery).toBe("burgers");
    expect(result.current.page).toBe(1);
    expect(result.current.sort).not.toBe("reviews");
  });

  test("clears search query when empty string is provided", () => {
    const { result } = renderHook(() => useRestaurantListState(), {
      wrapper: createWrapper(["/?q=pizza"]),
    });

    act(() => {
      result.current.setSearchQuery("");
    });

    expect(result.current.searchQuery).toBe("");
  });

  test("sets page number", () => {
    const { result } = renderHook(() => useRestaurantListState(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setPage(5);
    });

    expect(result.current.page).toBe(5);
  });

  test("sets sort option and resets page", () => {
    const { result } = renderHook(() => useRestaurantListState(), {
      wrapper: createWrapper(["/?page=3"]),
    });

    act(() => {
      result.current.setSort("deliveryCost");
    });

    expect(result.current.sort).toBe("deliveryCost");
    expect(result.current.page).toBe(1); // Should reset to 1
  });

  test("removes sort parameter when setting to bestMatch", () => {
    const { result } = renderHook(() => useRestaurantListState(), {
      wrapper: createWrapper(["/?sort=reviews"]),
    });

    act(() => {
      result.current.setSort("bestMatch");
    });

    expect(result.current.sort).toBe("bestMatch");
  });

  test("setMultiple updates multiple values at once", () => {
    const { result } = renderHook(() => useRestaurantListState(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setMultiple({
        searchQuery: "sushi",
        page: 2,
        sort: "estimatedDeliveryTime",
      });
    });

    expect(result.current.searchQuery).toBe("sushi");
    expect(result.current.page).toBe(2);
    expect(result.current.sort).toBe("estimatedDeliveryTime");
  });

  test("setMultiple handles partial updates", () => {
    const { result } = renderHook(() => useRestaurantListState(), {
      wrapper: createWrapper(["/?q=pizza&page=3&sort=reviews"]),
    });

    act(() => {
      result.current.setMultiple({
        page: 5,
      });
    });

    expect(result.current.searchQuery).toBe("pizza");
    expect(result.current.page).toBe(5);
    expect(result.current.sort).toBe("reviews");
  });

  test("setMultiple clears search query when empty string is provided", () => {
    const { result } = renderHook(() => useRestaurantListState(), {
      wrapper: createWrapper(["/?q=pizza"]),
    });

    act(() => {
      result.current.setMultiple({
        searchQuery: "",
      });
    });

    expect(result.current.searchQuery).toBe("");
  });

  test("setMultiple removes sort parameter when setting to bestMatch", () => {
    const { result } = renderHook(() => useRestaurantListState(), {
      wrapper: createWrapper(["/?sort=reviews"]),
    });

    act(() => {
      result.current.setMultiple({
        sort: "bestMatch",
      });
    });

    expect(result.current.sort).toBe("bestMatch");
  });

  test("validates and cleans up invalid page parameter", () => {
    const { result } = renderHook(() => useRestaurantListState(), {
      wrapper: createWrapper(["/?page=invalid"]),
    });

    expect(result.current.page).toBe(1);
  });

  test("validates and cleans up negative page parameter", () => {
    const { result } = renderHook(() => useRestaurantListState(), {
      wrapper: createWrapper(["/?page=-5"]),
    });

    expect(result.current.page).toBe(1);
  });

  test("validates and cleans up invalid sort parameter", () => {
    const { result } = renderHook(() => useRestaurantListState(), {
      wrapper: createWrapper(["/?sort=invalidSort"]),
    });

    expect(result.current.sort).toBe("bestMatch");
  });

  test("handles all valid sort options", () => {
    const validSortOptions = [
      "bestMatch",
      "reviews",
      "estimatedDeliveryTime",
      "minOrderAmount",
      "deliveryCost",
    ];

    validSortOptions.forEach((sortOption) => {
      const { result } = renderHook(() => useRestaurantListState(), {
        wrapper: createWrapper([`/?sort=${sortOption}`]),
      });

      expect(result.current.sort).toBe(sortOption);
    });
  });

  test("preserves other URL parameters when updating", () => {
    const { result } = renderHook(() => useRestaurantListState(), {
      wrapper: createWrapper(["/?q=pizza&page=2&sort=reviews&other=param"]),
    });

    act(() => {
      result.current.setPage(3);
    });

    expect(result.current.page).toBe(3);
    expect(result.current.searchQuery).toBe("pizza");
    expect(result.current.sort).toBe("reviews");
  });
});
