import { createSlice } from "@reduxjs/toolkit";




export const commonSlice = createSlice({

  name: "commonStore",
  initialState: {
    profile: {},

  },
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
  },
});

export const { setProfile } = commonSlice.actions;
export default commonSlice.reducer;