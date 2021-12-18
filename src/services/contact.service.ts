import { HubSpotConnector } from "../connector/hubspot.connector";

export class ContactService {
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
    return this.connector.search<{
      contacts: Array<{
        "identity-profiles": Array<{
          vid: number;
          identities: Array<{ type: string; value: string }>;
        }>;
      }>;
    }>(
      userId,
      { route: "https://api.hubapi.com/contacts/v1/lists/all/contacts/all" },
      this.config
    );
  }

  public create(userId: string) {
    const propBuilder = (property: string, value: string) => ({
      property,
      value,
    });
    const props = {
      properties: [
        propBuilder("email", `${userId}-${new Date().getTime()}@myapp.com`),
        propBuilder("firstname", userId),
        propBuilder("lastname", userId.split("").reverse().join("")),
        propBuilder("city", "Paris"),
        propBuilder("zip", "75001"),
      ],
    };
    return this.connector.create(
      userId,
      {
        route: "https://api.hubapi.com/contacts/v1/contact",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(props),
      },
      this.config
    );
  }
}
