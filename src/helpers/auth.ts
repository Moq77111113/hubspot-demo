import { NextFunction, Request, Response } from "express";
import { TokenCache } from "./token-cache";

export const isAuthorized = (userId: string) => {
  return TokenCache.instance().refreshTokenStore[userId] ? true : false;
};

export const checkAuth = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!isAuthorized(req.sessionID)) {
      return res.redirect("/authorize");
    }
    next();
  };
};
