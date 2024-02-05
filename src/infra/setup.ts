import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { AuthHelper } from "../helpers/AuthHelper";

// Custom Axios config type with custom flag to indicate whether its retry request or not.
interface RetryAxiosRequestConfig extends AxiosRequestConfig {
  isRetry?: boolean;
}

const setTokenInterceptors = () => {
  axios.interceptors.request.use(
    function (config) {
        // Attach Access Token in header
      const accessToken = AuthHelper.getAccessToken();
      config.headers.Authorization = `Bearer ${accessToken}`;
      console.log("Token attached")
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    function (response: any) {
        if(response.config.isRetry){
            console.log("Is Retry")
        }
      return response;
    },
    async function (error: AxiosError) {
      var config: RetryAxiosRequestConfig = error.config!;

      // If it is already retried, reject.
      if(config.isRetry){
        return Promise.reject(error);
      }

      // If Access Token was invalid, refresh and try again.
      if (error.response?.status === 401) {
        console.log("Token invalid")
        var response = await AuthHelper.getRefreshedToken();
        if (response == null) { // On refresh attempt failed
          return Promise.reject(new Error("Failed to refresh Access Token."));
        }
        config.headers!.Authorization = `Bearer ${response}`;
        AuthHelper.setAccessToken(response);

        config.isRetry = true;
        return axios(config);
      }
      return Promise.reject(error);
    }
  );
};

export { setTokenInterceptors};