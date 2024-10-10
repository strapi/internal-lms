import axios from "axios";
import { STRAPI_URL } from "./utils";
import { getAuthData } from "@/hooks/getAuthData";
import { redirect } from "@tanstack/react-router";

const axiosInstance = axios.create({
  baseURL: STRAPI_URL + "/api",
  headers: {
    Authorization: `Bearer ${getAuthData}`,
  },
});

axiosInstance.interceptors.request.use((ctx) => {
  // check to see if the Bearer token header is set correctly
  return ctx;
});

axiosInstance.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    if (error.status === 401 || error.status === 403) {
      throw redirect({ to: "/auth" });
    }
    return Promise.reject(error);
  },
);

export { axiosInstance };
