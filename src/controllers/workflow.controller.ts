import { Express, NextFunction, Request, response, Response } from "express";
import { checkAuth } from "../helpers/auth";
import { ContactService } from "../services/contact.service";
import { WorkflowService } from "../services/workflow.service";

export class WorkflowController {
  private workflowService: WorkflowService;
  private contactService: ContactService;
  private constructor(q: {
    CLIENT_ID: string;
    CLIENT_SECRET: string;
    REDIRECT_URI: string;
  }) {
    this.workflowService = new WorkflowService(q);
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
    const controller = new WorkflowController(q);
    app.get("/workflows", checkAuth(), controller.allWorkflows());
    app.get("/workflows/:id", checkAuth(), controller.enrollUser());
    return app;
  };
  private allWorkflows = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
      return this.workflowService
        .getAll(req.sessionID)
        .then((resp) => res.send(resp))
        .catch((err) => res.send(err));
    };
  };

  private enrollUser = () => {
    return async (req: Request, res: Response, nexT: NextFunction) => {
      try {
        const wfId = await this.workflowService
          .getAll(req.sessionID)
          .then((resp) => resp.workflows[0].id);
        if (!wfId) {
          throw new Error(
            "Unable to find any workflow please create one before"
          );
        }
        const email = await this.contactService
          .getAll(req.sessionID)
          .then(
            (resp) =>
              resp.contacts[0]["identity-profiles"][0].identities.find(
                (identity) => identity.type.toUpperCase() === "EMAIL"
              )?.value ?? undefined
          );
        if (!email) {
          throw new Error("Unable to find a contact with an email");
        } else {
          return this.workflowService
            .enrollInWorkflow(req.sessionID, { wfId, email })
            .then((resp) => {
              res.send(resp);
            })
            .catch((err) => res.status(err.status).send(err));
        }
      } catch (e) {
        res.status(404).send(e);
      }
    };
  };
}
