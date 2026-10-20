import { createSlice } from "@reduxjs/toolkit";
import { getApiMethos, postApiMethod, putApiMethod } from "../../components/services/gobal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { APICONSTANT } from "../../components/services/config";

export const appStateSlice = createSlice({
  name: "appState",
  initialState: {
    stateList: [],
  },
  reducers: {
    setStateList: (state, action) => {
      state.stateList = action.payload;
    },
  },
});

export const {
  setStateList,
} = appStateSlice.actions;
export default appStateSlice.reducer;

export function getStateList() {
  return async (dispatch) => {
    try {
      // const {
      //   data: datas,
      //   isLoading,
      //   error,
      // } = useQuery({
      //   queryKey: ["StateList", APICONSTANT.viewState],
      //   queryFn: getApiMethos,
      //   retry: 0,
      // });
      // console.log(datas, "redux")
    }
    catch (err) {
      console.log(err, "err")
    }
  }
}