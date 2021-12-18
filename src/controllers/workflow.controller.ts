import { Express, NextFunction, Request, Response } from "express";
import { checkAuth } from "../helpers/auth";
import { WorkflowService } from "../services/workflow.service";

export class WorkflowController {
  private workflowService: WorkflowService;
  private constructor(q: {
    CLIENT_ID: string;
    CLIENT_SECRET: string;
    REDIRECT_URI: string;
  }) {
    this.workflowService = new WorkflowService(q);
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
}
