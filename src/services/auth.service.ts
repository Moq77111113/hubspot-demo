import axios from "axios";
import qs from "qs";
import { HubSpotConnector } from "../connector/hubspot.connector";
import { TokenCache } from "../helpers/token-cache";
import { OAuthResponse, RefreshTokenProof, TokenProof } from "../types";

export class AuthService {
  public static askForTokens = async (user: string, proof: TokenProof) => {
    try {
      const oAuthToken = await HubSpotConnector.instance().claimToken(proof);
      TokenCache.instance().setAccessToken(
        user,
        oAuthToken.access_token,
        Math.round(oAuthToken.expires_in * 0.75)
      );
      TokenCache.instance().setRefreshToken(user, oAuthToken.refresh_token);
      return oAuthToken.access_token;
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  public static refreshAccessToken = async (
    userId: string,
    q: { CLIENT_ID: string; CLIENT_SECRET: string; REDIRECT_URI: string }
  ) => {
    const authProof: RefreshTokenProof = {
      grant_type: "refresh_token",
      client_id: q.CLIENT_ID,
      client_secret: q.CLIENT_SECRET,
      redirect_uri: q.REDIRECT_URI,
      refresh_token: TokenCache.instance().refreshTokenStore[userId],
    };
    return await this.askForTokens(userId, authProof);
  };

  public static getAccessToken = async (
    userId: string,
    q: { CLIENT_ID: string; CLIENT_SECRET: string; REDIRECT_URI: string }
  ) => {
    if (!TokenCache.instance().accessTokenCache.get(userId)) {
      await this.refreshAccessToken(userId, q);
    }
    return TokenCache.instance().accessTokenCache.get<string>(userId);
  };
}
