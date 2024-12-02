import axios from "axios";
import { STRAPI_URL } from "./utils";
import { getAuthData } from "@/hooks/getAuthData";
import { redirect } from "@tanstack/react-router";

const axiosInstance = axios.create({
  baseURL: `${STRAPI_URL}/api`,
});

// Request Interceptor to Set Authorization Header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthData(); // Call the function to get the latest JWT
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor to Handle Unauthorized Errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      // Redirect to the authentication page if unauthorized
      throw redirect({ to: "/login" });
    }
    return Promise.reject(error);
  },
);

export { axiosInstance };
