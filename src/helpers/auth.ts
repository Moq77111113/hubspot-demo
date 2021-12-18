import axios from "axios";
import qs from "qs";
import { OAuthResponse, RefreshTokenProof, TokenProof } from "../types";
import { TokenCache } from "./token-cache";

export const askForTokens = async (user: string, proof: TokenProof) => {
  try {
    const response = await axios.post<OAuthResponse>(
      "https://api.hubapi.com/oauth/v1/token",
      qs.stringify(proof),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    TokenCache.instance().setAccessToken(
      user,
      response.data.access_token,
      Math.round(response.data.expires_in * 0.75)
    );
    TokenCache.instance().setRefreshToken(user, response.data.refresh_token);
    return response.data.access_token;
  } catch (e) {
    console.error(e);
  }
};

export const refreshAccessToken = async (
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
  return await askForTokens(userId, authProof);
};

export const getAccessToken = async (
  userId: string,
  q: { CLIENT_ID: string; CLIENT_SECRET: string; REDIRECT_URI: string }
) => {
  if (!TokenCache.instance().accessTokenCache.get(userId)) {
    await refreshAccessToken(userId, q);
  }
  return TokenCache.instance().accessTokenCache.get<string>(userId);
};

export const isAuthorized = (userId: string) => {
  return TokenCache.instance().refreshTokenStore[userId] ? true : false;
};
