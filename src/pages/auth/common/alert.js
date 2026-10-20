import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  alert: {
    isOpen: false,
    message: '',
    type: '',
    severity: '',
  },
};

const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    addAlert: (state, action) => {
      state.alert = action.payload;
      toast.success("User logged in successfully", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

    },
    reset: (state) => {
      state.alert = initialState.alert;
    },
  },
});

export const { addAlert, reset } = alertSlice.actions;
export const alertSelector = (state) => state.alert;
export default alertSlice.reducer;
