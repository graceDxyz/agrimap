import { useBoundStore } from "@/lib/store";
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (request) => {
  const auth = useBoundStore.getState().auth;
  const accessToken = auth.accessToken;

  if (accessToken) {
    request.headers.Authorization = `Bearer ${accessToken}`;
  } else {
    // try {
    //   const res = await fetch(request.baseURL + "/sessions/current", {
    //     credentials: "include",
    //   });
    //   const data = await res.json();
    //   auth.setAuthUser(data);
    //   request.headers.Authorization = `Bearer ${data.accessToken}`;
    // } catch (err) {}
  }

  return request;
});

api.interceptors.response.use(async (response) => {
  return response;
});

export default api;
