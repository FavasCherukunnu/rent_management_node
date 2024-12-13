import { Router } from "express";
import { validateDataMiddleWare } from "../../middlewares/zod.validation.middleware.js";
import { AdminLoginController, AdminVerifyTokenController } from "../../controllers/user/authentication.controller.js";
import { z } from "zod";
const router = Router();
const verifyOTPSchema = z.object({
    email: z.string().email(),
    password: z.union([z.string(), z.number()]),
});
router.post('/login', validateDataMiddleWare(verifyOTPSchema), AdminLoginController);
router.post('/verify-token', AdminVerifyTokenController);
export { router as AdminAuthenticationRouter };
