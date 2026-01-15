import axios from "axios";
import { setAccessToken } from "../../../redux/userSlice";
import { store } from "../../../redux/store";
import { exchangeTokens } from "./api";
const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const newToken = await exchangeTokens();
        store.dispatch(setAccessToken(newToken));

        axiosInstance.defaults.headers.common.Authorization = newToken;

        return axiosInstance(originalRequest);
      } catch (exchangeError) {
        console.error("Token exchange failed:", exchangeError);
        // Assuming you have a custom navigateToLogin function for navigation
        // navigateToLogin(); // Implement this function to navigate to the login page
        return Promise.reject(exchangeError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
