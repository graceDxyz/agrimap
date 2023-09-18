import { SERVER } from "@/constant/server.constant";
import axios from "axios";

const api = axios.create({
  baseURL: SERVER + "/api",
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
