process.loadEnvFile();

import { app } from "./app.js";
import { grpcServer, grpc } from "./grpc.js";

function startGrpcServer() {
  const port = process.env.GRPC_PORT;
  if (!port) throw new Error("GRPC_PORT is not set");

  grpcServer.bindAsync(
    `127.0.0.1:${port}`,
    grpc.ServerCredentials.createInsecure(),
    (err, boundPort) => {
      if (err) {
        console.log("Failed to start grpc server:", err);
        process.exit(1);
      }

      console.log(`GRPC Server listening on port ${boundPort}`);
    },
  );
}

function startHttpServer() {
  const port = process.env.PORT;
  if (!port) throw new Error("PORT not set");

  return app.listen(Number(port), "127.0.0.1", () => {
    console.log(`Whatsapp adapter listening on port ${port}`);
  });
}

async function main() {
  const server = startHttpServer();
  startGrpcServer();

  const shutdown = () => {
    const forceTimeout = setTimeout(() => grpcServer.forceShutdown(), 5000);

    grpcServer.tryShutdown(() => {
      clearTimeout(forceTimeout);
      server.close(() => process.exit(0));
    });
  };

  process.on("SIGINT", shutdown);

  process.on("SIGTERM", shutdown);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
