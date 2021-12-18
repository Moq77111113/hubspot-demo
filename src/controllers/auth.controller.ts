import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { AccessTokenProof } from "../types";
import { Express } from "express";

export class AuthController {
  private constructor(q: {
    CLIENT_ID: string;
    CLIENT_SECRET: string;
    REDIRECT_URI: string;
  }) {}

  public static initialize = (
    app: Express,
    q: {
      CLIENT_ID: string;
      CLIENT_SECRET: string;
      REDIRECT_URI: string;
      AUTH_URL: string;
    }
  ) => {
    const controller = new AuthController(q);
    app.get("/authorize", controller.authorize(q.AUTH_URL));
    app.get("/oauth-callback", controller.authCallBack({ ...q }));
    return app;
  };
  private authorize = (authUrl: string) => {
    return (req: Request, res: Response, next: NextFunction) =>
      res.redirect(authUrl);
  };

  private authCallBack = (q: {
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
        AuthService.askForTokens(req.sessionID, authProof)
          .then(() => {
            res.redirect("/");
          })
          .catch((err) => {
            res.status(500).send(err);
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
}
