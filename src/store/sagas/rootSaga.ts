import { all } from "redux-saga/effects";
import counterSaga from "./counterSaga";
import restaurantsSaga from "./restaurantsSaga";

export function* rootSaga() {
  yield all([counterSaga(), restaurantsSaga()]);
}
