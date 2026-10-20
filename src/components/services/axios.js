import axios from "axios";

import { APIURLS } from "./config";

const api = axios.create({ baseUrl: APIURLS.baseUrl });
const jwt = localStorage.getItem("token");
api.defaults.headers.Authorization = jwt;
api.defaults.headers['ngrok-skip-browser-warning'] = true

api.interceptors.response.use(
  (response) => response,
  (err) => {
    const status = err.response?.status;
    try {
      if (status == 401) {
        // handle unauthorized
        // alert("401");
        localStorage.clear();
        window.location.href = "/";
      } else if (status == 404) {
        // handle not found
        // window.location.href ='/404'
        // alert("404");
      } else if (status == 500) {
        // alert("500");
        return err.response;
      } else {
        // Promise.reject(err);
        return err.response;
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }
);

export default api;
