import axios, { type AxiosInstance } from "axios";

export class AuthHelper {
  // Dedicated Axios instance for authentication related requests,
  // to avoid applying axios global interceptors
  static readonly authAxios: AxiosInstance = axios.create();

  constructor() {}

  static checkIfExpired() {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken == null || accessToken == "undefined") {
      return true;
    }

    var decodedPayload;
    try {
      decodedPayload = this.parseJwt(accessToken);
    } catch (e) {
      return true;
    }

    const expiry = new Date(decodedPayload.exp * 1000);

    return expiry < new Date();
  }

  static async checkIfAuthed() {
    // Check if Access Token is expired.
    let expired = this.checkIfExpired();

    // If Access Token is expired or not found, request new one.
    if (expired) {
      return await this.refreshToken();
    }

    return true;
  }

  static async refreshToken() {
    const refreshed = await this.getRefreshedToken();

    if (refreshed == null) {
      console.log("Failed to refresh Access Token");
      this.clearTokens();
      return false;
    }
    this.setAccessToken(refreshed);
    return true;
  }

  static async checkIfBanned(id: string) {
    try {
      let result = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users/${id}/ban`
      );
      let unbanDate = new Date(result.data.unbannedAtUtc);
      if (unbanDate > new Date()) {
        return {
          isBanned: true,
          banDate: new Date(result.data.bannedAtUtc),
          unbanDate: unbanDate,
          reason: result.data.reason,
          days: result.data.days,
        };
      }
    } catch (e) {}
    return {
      isBanned: false,
    };
  }

  static async signIn(email: string, password: string) {
    var response;
    try {
      response = await this.authAxios.post(
        import.meta.env.VITE_API_URL + "/api/auth/signIn",
        {
          email,
          password,
        }
      );
    } catch (e) {
      console.log(e);
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
      var response = await this.authAxios.post(
        import.meta.env.VITE_API_URL + "/api/auth/refreshToken",
        {
          refreshToken,
          accessToken,
        }
      );

      return response.data.data;
    } catch (e) {
      return null;
    }
  }

  static parseJwt = (token: string) => {
    let binString = atob(token.split(".")[1]);
    let bytes = Uint8Array.from(binString, (m) => m.codePointAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
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

    let rolesDecoded =
      decodedPayload[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ];

    var result: {
      id: string;
      email: string;
      username: string;
      roles: string[] | null;
    } = {
      id: decodedPayload[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ],
      email:
        decodedPayload[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
        ],
      username:
        decodedPayload[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
        ],
      roles: Array.isArray(rolesDecoded) ? rolesDecoded : [rolesDecoded],
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
