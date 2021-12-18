import { NextFunction, Request, Response } from "express";
import { askForTokens, isAuthorized } from "../helpers/auth";
import { AccessTokenProof } from "../types";

export const authorize = (authUrl: string) => {
  return (req: Request, res: Response, next: NextFunction) =>
    res.redirect(authUrl);
};

export const authCallBack = (q: {
  CLIENT_ID: string;
  CLIENT_SECRET: string;
  REDIRECT_URI: string;
}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.query.code) {
      // Check if the user auth code has been received
      // Then we can ask for access & refresh tokens.
      const authProof: AccessTokenProof = {
        grant_type: "authorization_code",
        client_id: q.CLIENT_ID,
        client_secret: q.CLIENT_SECRET,
        redirect_uri: q.REDIRECT_URI,
        code: req.query.code.toString(),
      };
      askForTokens(req.sessionID, authProof).then(() => {
        res.redirect("/");
      });
    } else {
      res
        .status(400)
        .send(
          `A code is missing  in the callback uri the server can not deal with the request.`
        );
    }
  };
};

export const checkAuth = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!isAuthorized(req.sessionID)) {
      return res.redirect("/authorize");
    }
    next();
  };
};
