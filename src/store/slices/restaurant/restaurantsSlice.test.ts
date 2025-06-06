import restaurantsReducer, {
  fetchRestaurantsStart,
  fetchRestaurantsSuccess,
  fetchRestaurantsFailure,
} from "./restaurantsSlice";
import type { Restaurant } from "../../../features/restaurants/types/Restaurant";

describe("restaurantsSlice", () => {
  const initialState = {
    restaurants: [],
    loading: false,
    error: null,
  };

  const mockRestaurant: Restaurant = {
    id: "1",
    name: "Test Restaurant",
    logoUrl: "https://example.com/logo.jpg",
    rating: {
      starRating: 4.5,
      count: 100,
    },
    cuisines: [{ name: "Italian" }],
    deliveryEtaMinutes: {
      rangeLower: 30,
      rangeUpper: 45,
    },
    deliveryCost: 2.99,
    minimumDeliveryValue: 15.0,
  };

  test("should return the initial state", () => {
    expect(restaurantsReducer(undefined, { type: "unknown" })).toEqual(
      initialState
    );
  });

  test("should handle fetchRestaurantsStart", () => {
    const actual = restaurantsReducer(initialState, fetchRestaurantsStart());
    expect(actual).toEqual({
      restaurants: [],
      loading: true,
      error: null,
    });
  });

  test("should handle fetchRestaurantsStart when there are existing restaurants", () => {
    const stateWithRestaurants = {
      restaurants: [mockRestaurant],
      loading: false,
      error: "Previous error",
    };

    const actual = restaurantsReducer(
      stateWithRestaurants,
      fetchRestaurantsStart()
    );
    expect(actual).toEqual({
      restaurants: [mockRestaurant],
      loading: true,
      error: null,
    });
  });

  test("should handle fetchRestaurantsSuccess", () => {
    const loadingState = {
      restaurants: [],
      loading: true,
      error: null,
    };

    const restaurants = [mockRestaurant];
    const actual = restaurantsReducer(
      loadingState,
      fetchRestaurantsSuccess(restaurants)
    );

    expect(actual).toEqual({
      restaurants: [mockRestaurant],
      loading: false,
      error: null,
    });
  });

  test("should handle fetchRestaurantsSuccess with empty array", () => {
    const loadingState = {
      restaurants: [mockRestaurant],
      loading: true,
      error: null,
    };

    const actual = restaurantsReducer(
      loadingState,
      fetchRestaurantsSuccess([])
    );

    expect(actual).toEqual({
      restaurants: [],
      loading: false,
      error: null,
    });
  });

  test("should handle fetchRestaurantsSuccess replacing existing restaurants", () => {
    const stateWithRestaurants = {
      restaurants: [mockRestaurant],
      loading: true,
      error: null,
    };

    const newRestaurant: Restaurant = {
      ...mockRestaurant,
      id: "2",
      name: "New Restaurant",
    };

    const actual = restaurantsReducer(
      stateWithRestaurants,
      fetchRestaurantsSuccess([newRestaurant])
    );

    expect(actual).toEqual({
      restaurants: [newRestaurant],
      loading: false,
      error: null,
    });
  });

  test("should handle fetchRestaurantsFailure", () => {
    const loadingState = {
      restaurants: [],
      loading: true,
      error: null,
    };

    const errorMessage = "Failed to fetch restaurants";
    const actual = restaurantsReducer(
      loadingState,
      fetchRestaurantsFailure(errorMessage)
    );

    expect(actual).toEqual({
      restaurants: [],
      loading: false,
      error: errorMessage,
    });
  });

  test("should handle fetchRestaurantsFailure while keeping existing restaurants", () => {
    const stateWithRestaurants = {
      restaurants: [mockRestaurant],
      loading: true,
      error: null,
    };

    const errorMessage = "Network error";
    const actual = restaurantsReducer(
      stateWithRestaurants,
      fetchRestaurantsFailure(errorMessage)
    );

    expect(actual).toEqual({
      restaurants: [mockRestaurant],
      loading: false,
      error: errorMessage,
    });
  });

  test("should handle multiple consecutive actions", () => {
    let state = restaurantsReducer(initialState, fetchRestaurantsStart());
    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);

    state = restaurantsReducer(
      state,
      fetchRestaurantsSuccess([mockRestaurant])
    );
    expect(state.loading).toBe(false);
    expect(state.restaurants).toEqual([mockRestaurant]);

    state = restaurantsReducer(state, fetchRestaurantsStart());
    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);

    state = restaurantsReducer(state, fetchRestaurantsFailure("Error"));
    expect(state.loading).toBe(false);
    expect(state.error).toBe("Error");
  });

  test("should preserve state immutability", () => {
    const state = { ...initialState };
    const newState = restaurantsReducer(state, fetchRestaurantsStart());

    expect(newState).not.toBe(state);
    expect(state.loading).toBe(false); // Original state unchanged
    expect(newState.loading).toBe(true);
  });
});
