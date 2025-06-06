import { configureStore } from "@reduxjs/toolkit";
import restaurantsReducer from "./slices/restaurant/restaurantsSlice";
import userReducer from "./slices/user/userSlice";
import createSagaMiddleware from "redux-saga";
import { rootSaga } from "./sagas/rootSaga";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    restaurants: restaurantsReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);
