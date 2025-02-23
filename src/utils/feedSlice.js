import { createSlice } from "@reduxjs/toolkit";

export const feedSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    addFeed: (state, action) => {
      return action.payload;
    },
    removeUserFromFeed: (state, action) => {
      const newFeed = state.filter((feed) => feed._id !== action.payload);
      return newFeed;
    },
    emptyFeed: () => {
      return null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { addFeed, removeUserFromFeed, emptyFeed } = feedSlice.actions;

export default feedSlice.reducer;
