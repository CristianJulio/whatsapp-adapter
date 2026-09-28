import { Router } from "express";
import { WhatsappControllers } from "./whatsapp.controllers.js";

const router = Router();

router.get("/webhook", WhatsappControllers.verify);
router.post("/webhook", WhatsappControllers.inbound);

export { router as WhatsappRouter };
