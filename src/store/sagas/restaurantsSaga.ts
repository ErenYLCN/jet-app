import { call, put, select, takeEvery } from "redux-saga/effects";
import type { SagaIterator } from "redux-saga";
import { getRestaurantsByPostcode, type RestaurantsApiResponse } from "../../api/jetApi";
import { fetchRestaurantsStart, fetchRestaurantsSuccess, fetchRestaurantsFailure } from "../slices/restaurantsSlice";
import type { RootState } from "../types/storeTypes";

const selectPostcode = (state: RootState) => state.user.postcode;

function* fetchRestaurantsSaga(): SagaIterator {
  try {
    const postcode: string = yield select(selectPostcode);
    const data: RestaurantsApiResponse = yield call(getRestaurantsByPostcode, postcode);
    yield put(fetchRestaurantsSuccess(data.restaurants || []));
  } catch (error) {
    yield put(fetchRestaurantsFailure(error instanceof Error ? error.message : "Failed to fetch restaurants"));
  }
}

function* restaurantsSaga(): SagaIterator {
  yield takeEvery(fetchRestaurantsStart.type, fetchRestaurantsSaga);
}

export default restaurantsSaga;
