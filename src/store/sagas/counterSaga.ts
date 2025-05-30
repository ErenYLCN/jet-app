import { put, takeEvery, delay } from "redux-saga/effects";
import { increment, incrementAsync } from "../slices/counterSlice";

function* handleIncrementAsync() {
  yield delay(500);
  yield put(increment());
}

function* counterSaga() {
  yield takeEvery(incrementAsync.type, handleIncrementAsync);
}

export default counterSaga;
