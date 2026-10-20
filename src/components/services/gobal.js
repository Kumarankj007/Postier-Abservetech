import { APIURLS } from "./config";
import axios from "./axios";

export const setToken = async (token) => {
  // console.log("tokennn", token);
  localStorage.setItem("token", token);
  //   localStorage.setItem("userId", userId);
};

export const getApiMethos = async ({ queryKey, signal }) => {
  // debugger
  let api;
  const [_key, apiConstant, query_string] = queryKey;
  if (query_string) {
    api =
      APIURLS.baseUrl + apiConstant + (query_string ? "?" + query_string : "");
  } else {
    api = APIURLS.baseUrl + apiConstant;
  }
  const deviceId = await localStorage.getItem("deviceId");
  const token = await localStorage.getItem("token");
  const config = {
    signal,
    headers: {
      "x-client-id": deviceId,
      Authorization: token,
    },
  };
  const response = await axios.get(api, config);
  // console.log("response", response.data);
  return response.data;
};

export const putApiMethod = async (data) => {
  try {
    const api = APIURLS.baseUrl + data.url.apiUrl;
    const deviceId = await localStorage.getItem("deviceId");
    const token = await localStorage.getItem("token");
    const config = {
      headers: {
        "x-client-id": deviceId,
        Authorization: token,
      },
    };
    const response = await axios.put(api, data.body, config);
    // if (response.type === 'success') {
    //   throw response.message
    // }
    // return response.data;
    if (response.data.type === "success") {
      return response.data;
    } else {
      throw response.data;
    }
  } catch (error) {
    // throw new Error(error, { cause: error })
    throw error;
  }
};

export const postApiMethod = async (data) => {
  // debugger;
  try {
    const api = APIURLS.baseUrl + data.url.apiUrl;
    const deviceId = await localStorage.getItem("deviceId");
    const token = await localStorage.getItem("token");

    const config = {
      headers: {
        "x-client-id": deviceId,
        Authorization: token,
      },
    };
    const response = await axios.post(api, data.body, config);
    if (response.data.type === "success") {
      return response.data;
    } else {
      throw response.data;
    }
  } catch (error) {
    // throw new Error(error, { cause: error })
    throw error;
  }
};

export const patchApiMethod = async (data) => {
  // debugger
  try {
    const api = APIURLS.baseUrl + data.url.apiUrl;
    const deviceId = await localStorage.getItem("deviceId");
    const token = await localStorage.getItem("token");

    const config = {
      headers: {
        "x-client-id": deviceId,
        Authorization: token,
      },
    };
    const response = await axios.patch(api, data.body, config);
    if (response.data.type === "success") {
      return response.data;
    } else {
      throw response.data;
    }
  } catch (error) {
    // throw new Error(error, { cause: error })
    throw error;
  }
}

export const deleteApiMethod = async (data) => {
  const api = APIURLS.baseUrl + data.url;
  const deviceId = localStorage.getItem("deviceId");
  const token = await localStorage.getItem("token");
  const config = {
    headers: {
      "x-client-id": deviceId,
      Authorization: token,
    },
  };
  const Id = data ? data.id : null;
  const response = await axios.delete(`${api}/${Id}`, config);
  return response.data;
};

// export const deleteApiMethod = async (data) => {
//   debugger
//   const userid = data ? data.id : null
//   try {
//     await axios.post(
//       APIURLS.baseUrl + data.url,
//       { userid },
//       {
//         headers: {
//           authorization: `${localStorage.getItem("token")}`,
//         },
//       }
//     );
//     // Remove the deleted item from the state
//     // setData((prevData) => prevData.filter((item) => item._id !== userId));
//   } catch (error) {
//     console.error("Error deleting user:", error);
//   }
// };
