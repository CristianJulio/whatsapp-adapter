import { MessagesGrpc } from "./modules/messages/messages.grpc.js";
import grpc from "@grpc/grpc-js";
import path from "path";
import protoLoader from "@grpc/proto-loader";
import type { GrpcObject, ServiceClientConstructor } from "@grpc/grpc-js";

const PROTO_PATH = path.join(import.meta.dirname, "../proto/message/v1/message.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const messager = grpc.loadPackageDefinition(packageDefinition)["messager"] as GrpcObject;
const proto = messager["v1"] as GrpcObject;
const Messager = proto["Messager"] as ServiceClientConstructor;

const server = new grpc.Server();
server.addService(Messager.service, MessagesGrpc);

export { server as grpcServer, grpc };
