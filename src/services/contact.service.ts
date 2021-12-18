import { HubSpotConnector } from "../connector/hubspot.connector";

export class ContactService {
  private readonly config: {
    CLIENT_ID: string;
    CLIENT_SECRET: string;
    REDIRECT_URI: string;
  };

  private connector : HubSpotConnector;
  constructor(q: {
    CLIENT_ID: string;
    CLIENT_SECRET: string;
    REDIRECT_URI: string;
  }) {
    this.config = q;
    this.connector = HubSpotConnector.instance()
  }

  public getAll(userId: string) {
    return this.connector.search(
      userId,
      { route: "https://api.hubapi.com/contacts/v1/lists/all/contacts/all" },
      this.config
    );
  }
}
