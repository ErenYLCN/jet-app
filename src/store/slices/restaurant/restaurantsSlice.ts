import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Restaurant } from "../../../features/restaurants/types/Restaurant";

interface RestaurantsState {
  restaurants: Restaurant[];
  loading: boolean;
  error: string | null;
}

const initialState: RestaurantsState = {
  restaurants: [],
  loading: false,
  error: null,
};

const restaurantsSlice = createSlice({
  name: "restaurants",
  initialState,
  reducers: {
    fetchRestaurantsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchRestaurantsSuccess: (state, action: PayloadAction<Restaurant[]>) => {
      state.loading = false;
      state.restaurants = action.payload;
    },
    fetchRestaurantsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchRestaurantsStart,
  fetchRestaurantsSuccess,
  fetchRestaurantsFailure,
} = restaurantsSlice.actions;

export default restaurantsSlice.reducer;
