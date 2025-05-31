import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slices/counterSlice";
import restaurantsReducer from "./slices/restaurantsSlice";
import createSagaMiddleware from "redux-saga";
import { rootSaga } from "./sagas/rootSaga";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    restaurants: restaurantsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);
