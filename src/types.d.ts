interface TokenProof {
  grant_type: "authorization_code" | "refresh_token";
  client_id: string;
  client_secret: string;
  redirect_uri: string;
}

interface AccessTokenProof extends TokenProof {
  grant_type: "authorization_code";
  code: string;
}

interface RefreshTokenProof extends TokenProof {
  grant_type: "refresh_token";
  refresh_token: string;
}
interface OAuthResponse {
  token_type: string;
  refresh_token: string;
  access_token: string;
  expires_in: number;
}

export { TokenProof, AccessTokenProof, RefreshTokenProof, OAuthResponse };
