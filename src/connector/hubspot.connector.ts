import axios, { AxiosError } from "axios";
import qs from "qs";
import { AuthService } from "../services/auth.service";
import { OAuthResponse, TokenProof } from "../types";

export class HubSpotConnector {
  private static _instance: HubSpotConnector;

  public static instance = () => {
    if (!this._instance) {
      this._instance = new HubSpotConnector();
    }
    return this._instance;
  };
  public search = async <T extends any>(
    userId: string,
    hs: { route: string; headers?: { [key: string]: string } },
    q: {
      CLIENT_ID: string;
      CLIENT_SECRET: string;
      REDIRECT_URI: string;
    }
  ) => {
    const token = await AuthService.getAccessToken(userId, q);
    return axios
      .get<T>(hs.route, {
        headers: { ...hs.headers, Authorization: `Bearer ${token}` },
      })
      .then((resp) => resp.data)
      .catch((err: AxiosError) => {
        throw (
          err.response?.data ?? { code: 500, message: "Internal server Error" }
        );
      });
  };

  public create = async <T extends object>(
    userId: string,
    hs: { route: string; headers?: { [key: string]: string }, body?: any },
    q: {
      CLIENT_ID: string;
      CLIENT_SECRET: string;
      REDIRECT_URI: string;
    }
  ) => {
    const token = await AuthService.getAccessToken(userId, q);
    return axios
      .post<T>(hs.route, hs.body, {
        headers: { ...hs.headers, Authorization: `Bearer ${token}` },
      })
      .then((resp) => resp.data)
      .catch((err: AxiosError) => {
        throw (
          { ...err.response?.data, status: err.response?.status} ?? { code: 500, message: "Internal server Error" }
        );
      });
  };

  public claimToken = (proof: TokenProof) => {
    return axios
      .post<OAuthResponse>(
        "https://api.hubapi.com/oauth/v1/token",
        qs.stringify(proof),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((response) => response.data)
      .catch((err: AxiosError) => {
        throw err.response;
      });
  };
}
