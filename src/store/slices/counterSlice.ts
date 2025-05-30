import { createSlice } from "@reduxjs/toolkit";

interface CounterState {
  value: number;
}

const initialState: CounterState = {
  value: 0,
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    incrementAsync: () => {
      // Handled by saga
    },
  },
});

export const { increment, incrementAsync } = counterSlice.actions;
export default counterSlice.reducer;
