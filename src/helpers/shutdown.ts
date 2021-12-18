import http from "http";

export const shutdown = (server: Promise<http.Server>) => {
  console.info(`Received signal to shutdown application...`);
  setTimeout(() => {
    server.then((httpServer) => {
      // Do some stuff
      httpServer.close(() => {
        console.info("Exiting...");
        process.exit(1);
      });
    });
  }, parseInt(process.env.SHUTDOWN_TTL || "0", 10));
};
