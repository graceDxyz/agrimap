import axios from "axios";

// const BE_BASE_URL = "http://192.168.254.126:5000/api";
const isProd = import.meta.env.PROD;
const origin = isProd
  ? `${window.location.origin}`
  : `http://${window.location.hostname}:5000`;

const api = axios.create({
  baseURL: origin + "/api",
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// api.interceptors.request.use(async (request) => {
//   const accessToken = localStorage.getItem("accessToken");
//   if (accessToken) {
//     request.headers.Authorization = `Bearer ${accessToken}`;
//   }
//   return request;
// });

api.interceptors.response.use(async (response) => {
  return response;
});

export default api;
