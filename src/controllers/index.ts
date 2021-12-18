import { Express } from "express";
import { AuthController } from './auth.controller';
import { ContactController } from './contact.controller';
import { WorkflowController } from './workflow.controller';


export namespace HubSpotServer {
  export const Bootstrap = async (
    app: Express,
    q: {
      CLIENT_ID: string;
      CLIENT_SECRET: string;
      REDIRECT_URI: string;
      AUTH_URL: string;
    }
  ) => {
    app = AuthController.initialize(app, q)
    app = ContactController.initialize(app, q);
    app = WorkflowController.initialize(app, q);
    return app;
  };
}
