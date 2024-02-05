import axios, { type AxiosInstance } from "axios";

export class AuthHelper {
  // Dedicated Axios instance for authentication related requests,
  // to avoid applying axios global interceptors
  static readonly authAxios: AxiosInstance = axios.create();

  constructor() {}

  static async checkIfAuthed() {
    const refreshToken = localStorage.getItem("refreshToken");
    const accessToken = localStorage.getItem("accessToken");

    // Check if Access Token exists first.
    if (accessToken == null || accessToken == "undefined") {
      this.clearTokens();
      return false;
    }

    var decodedPayload;
    try {
      decodedPayload = this.parseJwt(accessToken);
    } catch (e) {
      this.clearTokens();
      return false;
    }

    const expiry = new Date(decodedPayload.exp * 1000);

    // If Access Token is expired, request new one.
    if (expiry < new Date()) {
      const refreshed = await this.getRefreshedToken();

      if (refreshed == null) {
        this.clearTokens();
        return false;
      }
      this.setAccessToken(refreshed);
    }
    return true;
  }

  static async signIn(id: string, password: string) {
    var response;
    try {
      response = await this.authAxios.post("/api/auth/signIn", {
        id,
        password,
      });
    } catch (e) {
      return null;
    }

    var result: {
      accessToken: string;
      refreshToken: string;
    } = {
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
    };

    return result;
  }

  static async getRefreshedToken() {
    const refreshToken = this.getRefreshToken();
    const accessToken = this.getAccessToken();

    if (refreshToken == null || accessToken == null) {
      return null;
    }

    try {
      var response = await this.authAxios.post("/api/auth/refreshToken", {
        refreshToken,
        accessToken,
      });

      return response.data.data;
    } catch (e) {
      return null;
    }
  }

  static parseJwt = (token: string) => {
    return JSON.parse(atob(token.split(".")[1]));
  };

  // Decodes Access Token and returns its value.
  // Does not check if it's expired.
  static getUser() {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken == null || accessToken == "undefined") {
      return null;
    }

    var decodedPayload;
    try {
      decodedPayload = AuthHelper.parseJwt(accessToken!);
    } catch (e) {
      return null;
    }

    let rolesDecoded = decodedPayload[
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    ];

    var result: {
      id: string;
      username: string;
      roles: string[] | null;
    } = {
      id: decodedPayload[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ],
      username:
        decodedPayload[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
        ],
      roles:
        Array.isArray(rolesDecoded) ? rolesDecoded : [rolesDecoded]
    };

    return result;
  }

  static getRefreshToken() {
    const token = localStorage.getItem("refreshToken");
    if (token == null || token == "undefined") {
      return null;
    }
    return token;
  }

  static setRefreshToken(token: string) {
    localStorage.setItem("refreshToken", token);
  }

  static getAccessToken() {
    const token = localStorage.getItem("accessToken");
    if (token == null || token == "undefined") {
      return null;
    }
    return token;
  }

  static setAccessToken(token: string) {
    localStorage.setItem("accessToken", token);
  }

  static clearTokens() {
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");
  }
}
