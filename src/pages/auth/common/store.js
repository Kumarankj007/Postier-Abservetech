// import { createSlice } from "@reduxjs/toolkit";
// import { toast } from "react-toastify";
// import { v4 as uuidv4 } from "uuid";

// const initialUsers = () => {

    
//   const item = window.localStorage.getItem("token");
  
//   return item
//     ? JSON.parse(item)
//     : [
//         {
//           id: uuidv4(),
//           name: "dashcode",
//           email: "dashcode@gmail.com",
//           password: "dashcode",
//         },
//       ];
// };

// const initialIsAuth = () => {
    
//     const item = window.localStorage.getItem("token");

    
//     return item ? true : false;
//   };


// export const authSlice = createSlice({
//   name: "auth",
//   initialState: {
  
//     isAuth: initialIsAuth,
//     // alert: {
//     //   position: "top-right",
//     //   autoClose: 1500,
//     //   hideProgressBar: false,
//     //   closeOnClick: true,
//     //   pauseOnHover: true,
//     //   draggable: true,
//     //   progress: undefined,
//     //   theme: "light",
//     // },
//   },
//   reducers: {
//     handleLogin: (state, action) => {

//         console.log('isauth===')
//     //   state.isAuth == action.payload;
//     //   window.localStorage.setItem("isAuth", JSON.stringify(state.isAuth));
  
//     },

//     addAlert: (state, action) => {
//       state.alert = action.payload;
//       toast.success("User logged in successfully", alert);
//     },
//   },
// });

// export const { handleLogin, addAlert } = authSlice.actions;
// export default authSlice.reducer;



import { createSlice } from "@reduxjs/toolkit";

// theme config import
import themeConfig from "@/configs/themeConfig";

const initialRtl = () => {
  const item = window.localStorage.getItem("direction");
  return item ? JSON.parse(item) : themeConfig.layout.isRTL;
};


const initialState = {
  isRTL: initialRtl(),
  customizer: themeConfig.layout.customizer,
  isAuth :false
};

export const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {

    handleCustomizer: (state, action) => {
      state.customizer = action.payload;
    },
  
    handleRtl: (state, action) => {
      state.isRTL = action.payload;
      window.localStorage.setItem("direction", JSON.stringify(action.payload));
    },
    handleLogin: (state, action) => {

        state.isAuth = action.payload;
        window.localStorage.setItem("isAuth", JSON.stringify(action.payload));
      },

  },
});

export const {
  handleCustomizer,
  handleRtl,
  handleLogin
 
} = layoutSlice.actions;

export default layoutSlice.reducer;
