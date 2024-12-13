import { Router } from "express";
import { ContactusSentMailController } from "../controllers/contactus.controller.js";
import { validateDataMiddleWare } from "../middlewares/zod.validation.middleware.js";
import { z } from "zod";
const router = Router();
router.post('/sent-email', validateDataMiddleWare(z.object({
    name: z.string().min(3),
    email: z.string().email(),
    message: z.string().min(3),
})), ContactusSentMailController);
export { router as ContactUsRouter };
