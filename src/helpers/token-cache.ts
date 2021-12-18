import NodeCache from "node-cache";

export class TokenCache {
  private static _instance: TokenCache;
  public readonly accessTokenCache: NodeCache;
  public readonly refreshTokenStore: { [userId: string]: string } = {};

  private constructor() {
    this.accessTokenCache = new NodeCache({ deleteOnExpire: true });
  }

  static instance() {
    if (!this._instance) {
      this._instance = new TokenCache();
    }
    return this._instance;
  }

  setAccessToken(userId: string, token: string, ttl: number) {
    this.accessTokenCache.set(userId, token, ttl);
  }

  setRefreshToken(userId: string, token: string) {
    this.refreshTokenStore[userId] = token;
  }
}
