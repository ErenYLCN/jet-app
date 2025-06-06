import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  postcode: string;
}

const initialState: UserState = {
  postcode: "CT12EH",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setPostcode: (state, action: PayloadAction<string>) => {
      state.postcode = action.payload;
    },
  },
});

export const { setPostcode } = userSlice.actions;

export default userSlice.reducer;
