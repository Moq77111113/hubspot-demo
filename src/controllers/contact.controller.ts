import { Express, NextFunction, Request, Response } from "express";
import { checkAuth } from '../helpers/auth';
import { ContactService } from "../services/contact.service";
export class ContactController {
  private contactService: ContactService;
  private constructor(q: {
    CLIENT_ID: string;
    CLIENT_SECRET: string;
    REDIRECT_URI: string;
  }) {
    this.contactService = new ContactService(q);
  }

  public static initialize = (
    app: Express,
    q: {
      CLIENT_ID: string;
      CLIENT_SECRET: string;
      REDIRECT_URI: string;
    }
  ) => {
    const controller = new ContactController(q);
    app.get("/contacts", checkAuth(), controller.allContacts());
    return app;
  };
  private allContacts = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
      return this.contactService
        .getAll(req.sessionID)
        .then((resp) => res.send(resp))
        .catch((err) => res.send(err));
    };
  };
}
