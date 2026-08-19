import axios from "axios";

// Atur base URL API
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.headers.post["Accept"] = "application/json";
axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    console.log(error.response);
    return Promise.reject(error);
  }
);

export default axios;
