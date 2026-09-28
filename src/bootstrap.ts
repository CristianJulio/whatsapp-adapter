process.loadEnvFile()

import { app } from "./app.js";

function startHttpServer() {
  const port = process.env.PORT;
  if (!port) throw new Error("PORT not set");

  return app.listen(Number(port), "127.0.0.1", () => {
    console.log(`Whatsapp adapter listening on port ${port}`);
  });
}

async function main() {
  const server = startHttpServer();

  const shutdown = () => {
    server.close();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);

  process.on("SIGTERM", shutdown);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
