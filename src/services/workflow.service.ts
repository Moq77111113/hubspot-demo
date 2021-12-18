import { HubSpotConnector } from "../connector/hubspot.connector";

export class WorkflowService {
  private connector: HubSpotConnector;
  constructor(
    private readonly config: {
      CLIENT_ID: string;
      CLIENT_SECRET: string;
      REDIRECT_URI: string;
    }
  ) {
    this.connector = HubSpotConnector.instance();
  }

  public getAll(userId: string) {
    return this.connector.search<{ workflows: { id: number }[] }>(
      userId,
      { route: "https://api.hubapi.com/automation/v3/workflows" },
      this.config
    );
  }

  public enrollInWorkflow(userId: string, q: { wfId: number; email: string }) {
    return this.connector.create(
      userId,
      {
        route: `https://api.hubapi.com/automation/v2/workflows/${q.wfId}/enrollments/contacts/${q.email}`,
        headers: { "Content-Type": "application/json" },
      },
      this.config
    );
  }
}
