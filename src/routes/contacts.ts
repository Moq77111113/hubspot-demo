import axios from "axios";
import { NextFunction, Request, Response } from "express";
import { getAccessToken } from "../helpers/auth";

export const allContacts = (q: {
  CLIENT_ID: string;
  CLIENT_SECRET: string;
  REDIRECT_URI: string;
}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = await getAccessToken(req.sessionID, q);
    return axios
      .get("https://api.hubapi.com/contacts/v1/lists/all/contacts/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((resp) => res.send(resp.data))
      .catch((err) => res.send(err));
  };
};
