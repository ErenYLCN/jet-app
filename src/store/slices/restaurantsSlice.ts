import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Restaurant } from "../../models/Restaurant.model";

interface RestaurantsState {
  restaurants: Restaurant[];
  loading: boolean;
  error: string | null;
  postcode: string;
}

const initialState: RestaurantsState = {
  restaurants: [],
  loading: false,
  error: null,
  postcode: "",
};

const restaurantsSlice = createSlice({
  name: "restaurants",
  initialState,
  reducers: {
    fetchRestaurantsStart: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
      state.postcode = action.payload;
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

export const { fetchRestaurantsStart, fetchRestaurantsSuccess, fetchRestaurantsFailure } = restaurantsSlice.actions;

export default restaurantsSlice.reducer;
