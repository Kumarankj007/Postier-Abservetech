// api.js

import { getCookie, setCookie } from "@/utils";
import UseLoadingRouter from "../hooks/useLoadingRoutes";;
import fetchAPI from "./fetchapi";
import useLoaderStore from "../hooks/loader";
import { headers } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const controllerMap = new Map();

const controller = new AbortController();

// async function fetchWrapper(url:any, options:any) {
//   const response = await fetch(url, options);
//   if (!response.ok) {
//     // throw new Error(`HTTP error! status: ${response.status}`);

//   }
//   return await response.json();
// }

// export async function get(endpoint:any) {
//   const url = `${BASE_URL}/${endpoint}`;
//   return await fetchWrapper(url, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });
// }

// export async function postapimethod(endpoint:any, data:any) {
//   const url = `${BASE_URL}/${endpoint}`;
//   return await fetchWrapper(url, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(data),
//   });
// }

// export async function put(endpoint:any, data:any) {
//   const url = `${BASE_URL}/${endpoint}`;
//   return await fetchWrapper(url, {
//     method: 'PUT',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(data),
//   });
// }

// export async function del(endpoint:any) {
//   const url = `${BASE_URL}/${endpoint}`;
//   return await fetchWrapper(url, {
//     method: 'DELETE',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });
// }

// API.token = newtokenvlalues
// API.deviceId = 'newdeviceid'

const encodeQueryString = (params:Record<string, string>) => {
  return Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${params[key]}`)
    .join('&');
};

export const API = {

  token: typeof window !== "undefined" && getCookie("appToken"),
  deviceId: typeof window !== "undefined" && window.localStorage.getItem("deviceId"),
  baseurl: BASE_URL,
  get commonHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: this.token,
      'x-client-id': this.deviceId,
      'ngrok-skip-browser-warning' : true,
    };
  },
  GET: async function (endpoint: any, data: any = {}) {
    const { setLoading } = useLoaderStore.getState();
    try {
      setLoading(true)
      // const queryString = new URLSearchParams(data).toString();
      const queryString = encodeQueryString(data);
      let payload: any = {
        'credentials': 'omit',
        'method': 'GET',
        'headers': this.commonHeaders
      };
      // if(controllerMap.has(endpoint)) {
      //   const controller = controllerMap.get(endpoint);
      //   controller.abort(); //abort previous request
      //   console.log('controller Exists', controller);
      // }
        // const controller = new AbortController();
        // payload.signal = controller.signal;
        // controllerMap.set(endpoint, controller);
        // console.log('new controller', controller);
        // controller.abort();

        // payload.signal = controller.signal;
      const resource: any = await fetchAPI(
        `${this.baseurl}/${endpoint}${queryString?'?'+queryString:''}`,
        payload
      )
      // console.log(resource, 'resource')
      if (resource.response.status !== 200) {
        setLoading(true)
        throw resource.data.message || 'failed';
      }
      setLoading(false)
      return resource.data;
    } catch (err: any) {
      setLoading(false)
      return err;
      // throw Error(err, { cause: err })
    } finally {
      setLoading(false)
    }
  },


  POST: async function (endpoint: any, data?: any) {
    const { setLoading } = useLoaderStore.getState();
    try {
      setLoading(true)
      let payload: any = {};
      payload.method = 'POST';
      payload.headers = this.commonHeaders;

      if (data instanceof FormData) {
        payload.body = data
        delete payload.headers["Content-Type"];
      } else {
        payload.body = JSON.stringify(data);
      }
      const resource: any = await fetchAPI(
        `${this.baseurl}/${endpoint}`,
        payload
      )
      if (resource.response.status !== 200) {
        setLoading(true)
        throw resource.data || { message: 'failed'};
      }
      setLoading(false)
      return resource.data;
    } catch (err: any) {
      setLoading(false)
      if (err) {
        throw err;
      }
    } finally {
      setLoading(false)
    }
  },


  PUT: async function (endpoint: any, data?: any) {
    const { setLoading } = useLoaderStore.getState();
    try {
      
      setLoading(true)
      let payload: any = {};
      payload.method = 'PUT';
      payload.headers = this.commonHeaders;
      if (data instanceof FormData) {
        payload.body = data
        delete payload.headers["Content-Type"];
        // payload.headers["Content-Type"]= "application/x-www-form-urlencoded";
      } else {
        payload.body = JSON.stringify(data);
      }
      const resource: any = await fetchAPI(
        `${this.baseurl}/${endpoint}`,
        payload
      )
      
      if (resource.response.status !== 200) {
        setLoading(true)
        throw resource.data.message || 'failed';
      }
      setLoading(false)
      return resource.data;
    } catch (err: any) {
      setLoading(false)
      if (err) {
        throw err;
      }
    } finally {
      setLoading(false)
    }
  },
  PATCH: async function (endpoint: any, data?: any) {
    const { setLoading } = useLoaderStore.getState();
    try {
      setLoading(true)
      let payload: any = {};
      payload.method = 'PATCH';
      payload.headers = this.commonHeaders;
      if (data instanceof FormData) {
        payload.body = data
      } else {
        payload.body = JSON.stringify(data);
      }
      const resource: any = await fetchAPI(
        `${this.baseurl}/${endpoint}`,
        payload
      )
      if (resource.response.status !== 200) {
        setLoading(true)
        throw resource.data.message || 'failed';
      }
      setLoading(false)
      return resource.data;
    } catch (err: any) {
      setLoading(false)
      throw new Error(err, { cause: err })
    } finally {
      setLoading(false)
    }
  },
  DELETE: async function (endpoint: any, data?: any) {
    const { setLoading } = useLoaderStore.getState();
    try {
      setLoading(true)
      let payload: any = {};
      payload.method = 'DELETE';
      payload.headers = this.commonHeaders;
      payload.body = JSON.stringify(data);

      const resource: any = await fetchAPI(
        `${this.baseurl}/${endpoint}`,
        payload
      )
      if (resource.response.status !== 200) {
        setLoading(true)
        throw resource.data || { message: 'failed'};
      }
      setLoading(false)
      return resource.data;
    } catch (err: any) {
      setLoading(false)
      if (err) {
        throw err;
      }
    } finally {
      setLoading(false)
    }


  },

}