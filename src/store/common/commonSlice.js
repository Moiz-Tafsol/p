import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // allEmployees: [],
  allCategories: [],
  newNotifications: [],
};

const commonSlice = createSlice({
  name: "commonSlice",
  initialState,
  //   reducer needs a map
  reducers: {
    setAllCategories(state, action) {
      state.allCategories = action.payload;
      // state.allCompanies = action.payload?.allCompanies;
    },
    saveNewNotification(state, action) {
      state.newNotifications = action.payload;
    },
  },
});

export const { setAllCategories, saveNewNotification } = commonSlice.actions;

export default commonSlice.reducer;
