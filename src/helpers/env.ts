/**
 * Define variables according to environment
 * @returns
 */
export const checkEnv = () => {
  try {
    //==========================================================================//
    //  EXPRESS
    const PORT = parseInt(process.env.PORT || "3000", 10);
    const SESSION_SECRET =
      process.env.SESSION_SECRET || Math.random().toString(36).substring(2);
    //===========================================================================//
    //  HUBSPOT APP CONFIGURATION
    //
    //  All the following values must match configuration settings in your app.
    //  They will be used to build the OAuth URL, which users visit to begin
    //  installing. If they don't match your app's configuration, users will
    //  see an error page.
    if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET) {
      throw new Error(
        "Missing CLIENT_ID or CLIENT_SECRET environment variable."
      );
    }
    const CLIENT_ID = process.env.CLIENT_ID;
    const CLIENT_SECRET = process.env.CLIENT_SECRET;

    // Scopes for this app will default to `crm.objects.contacts.read`
    // To request others, set the SCOPE environment variable instead
    let SCOPES = "crm.objects.contacts.read";
    if (process.env.SCOPE) {
      SCOPES = process.env.SCOPE.split(/ |, ?|%20/).join(" ");
    }
    // On successful install, users will be redirected to /oauth-callback
    const REDIRECT_URI = `http://localhost:${PORT}/oauth-callback`;

    const AUTH_URL =
      "https://app.hubspot.com/oauth/authorize" +
      `?client_id=${encodeURIComponent(CLIENT_ID)}` + // app's client ID
      `&scope=${encodeURIComponent(SCOPES)}` + // scopes being requested by the app
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`; // where to send the user after the consent page

    return {
      PORT,
      SESSION_SECRET,
      CLIENT_ID,
      CLIENT_SECRET,
      AUTH_URL,
      REDIRECT_URI,
    };
  } catch (e) {
    console.error(e);
    process.exit();
  }
};
