import express, { type Request, type Response } from "express";
import { WhatsappRouter } from "./modules/whatsapp/whatsapp.routes.js";

const app = express();

app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "Ok" });
});

app.use("/api/whatsapp", WhatsappRouter)

export { app };
