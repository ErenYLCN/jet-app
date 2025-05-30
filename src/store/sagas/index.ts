import { all } from "redux-saga/effects";
import counterSaga from "./counterSaga";

export function* rootSaga() {
  yield all([counterSaga()]);
}
