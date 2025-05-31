import { call, put, takeEvery } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { SagaIterator } from "redux-saga";
import { getRestaurantsByPostcode, type RestaurantsApiResponse } from "../../api/jetApi";
import { fetchRestaurantsStart, fetchRestaurantsSuccess, fetchRestaurantsFailure } from "../slices/restaurantsSlice";

function* fetchRestaurantsSaga(action: PayloadAction<string>): SagaIterator {
  try {
    const data: RestaurantsApiResponse = yield call(getRestaurantsByPostcode, action.payload);
    yield put(fetchRestaurantsSuccess(data.restaurants || []));
  } catch (error) {
    yield put(fetchRestaurantsFailure(error instanceof Error ? error.message : "Failed to fetch restaurants"));
  }
}

function* restaurantsSaga(): SagaIterator {
  yield takeEvery(fetchRestaurantsStart.type, fetchRestaurantsSaga);
}

export default restaurantsSaga;
