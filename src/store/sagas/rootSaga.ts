import { all } from "redux-saga/effects";
import restaurantsSaga from "./restaurantsSaga";

export function* rootSaga() {
  yield all([restaurantsSaga()]);
}
