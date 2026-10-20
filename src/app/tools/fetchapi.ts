// config

import { getCookie, setCookie } from "@/utils";
import { Logout } from "./mutatefn/auth";

// ----------------------------------------------------------------------

const fetchAPI = async (url:any, {signal, ...options}:any) => {

  try {
    const response = await fetch(url,{
      ...options,
      signal
    });
    if (!response.ok) {
      const status = response.status;
      if (status === 401) {
        // handle unauthorized
        setCookie('appToken', '', -1)
        localStorage.clear();
        window.location.href = "/";
      }
       else if (status === 404) {
        const res = await response.json();
        return {
          data:res,
          response 
        }
      } else if (status === 500) {
        // handle server error\
        const res = await response.json();
        return {
          data:res,
          response 
        }
      } else {
        const errorData = await response.json();
        return Promise.reject(errorData);
      }
    }
    const res = await response.json();

    return {
        data:res,
        response 
    };
  } catch (error) {
    return Promise.reject(error);
  }
};

export default fetchAPI;
