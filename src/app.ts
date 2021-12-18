import { config as loadEnv } from "dotenv";
import express from "express";
import session from "express-session";
import { isAuthorized } from "./helpers/auth";
import { checkEnv } from "./helpers/env";
import { shutdown } from "./helpers/shutdown";
import { HubSpotServer } from "./controllers";
import { AuthService } from "./services/auth.service";
loadEnv({ path: __dirname + "\\..\\.env" });

const {
  PORT,
  SESSION_SECRET,
  CLIENT_ID,
  CLIENT_SECRET,
  AUTH_URL,
  REDIRECT_URI,
} = checkEnv();

// Instanciate express
const app = express();

//  Express middlewares
app.use(
  session({ secret: SESSION_SECRET, resave: true, saveUninitialized: true })
);

// Home
app.get("/", async (req, res, next) => {
  res.setHeader("Content-Type", "text/html");
  res.write("<h1>Hubspot test server</h1>");

  if (isAuthorized(req.sessionID)) {
    AuthService.getAccessToken(req.sessionID, {
      CLIENT_ID,
      CLIENT_SECRET,
      REDIRECT_URI,
    }).then(() => {
      // res.write(`Your token : ${token}\n`)
      res.write(`Welcome to the app, here are some test applications :`);
      res.write(`<ul>`);
      res.write(`<li><a href="/contacts">All Contacts</a></li>`);
      res.write(`<li><a href="/workflows">All Workflows</a></li>`);
      res.write(`</ul>`);
    });
  } else {
    res.write(
      `Not authorized, let's auth: <a href="/authorize">Click here</a>`
    );
  }
  res.end();
});

// Server launch
const server = HubSpotServer.Bootstrap(app, {
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
  AUTH_URL,
}).then((app) =>
  app.listen(PORT, () => {
    console.info(`🚀 Server listening on port : ${PORT}`);
  })
);

// Handle graceful shutdown
process.on("SIGINT", () => shutdown(server));
process.on("SIGTERM", () => shutdown(server));
