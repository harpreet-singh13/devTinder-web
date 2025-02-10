import { createSlice } from "@reduxjs/toolkit";

export const feedSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    addFeed: (state, action) => {
      return action.payload;
    },
    removeFeed: (state, action) => {
      return null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { addFeed, removeFeed } = feedSlice.actions;

export default feedSlice.reducer;
