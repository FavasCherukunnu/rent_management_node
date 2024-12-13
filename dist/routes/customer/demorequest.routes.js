import { Router } from "express";
import { validateDataMiddleWare } from "../../middlewares/zod.validation.middleware.js";
import { z } from "zod";
import { CreateDemoRequestController } from "../../controllers/customer/demorequest.controller.js";
const router = Router();
const DemoRequestSchema = z.object({
    company_name: z.string().min(3).max(1055),
    industry: z.string().min(3).max(1055),
    web: z.string().nullable(),
    email: z.string().email(),
    contact_name: z.string().min(3).max(1055),
    designation: z.string().min(3).max(1055),
    mobile: z.string().min(10).max(15),
    whatsapp: z.string().nullable(),
    product_interests: z.string().min(3).max(1055),
    company_description: z.string().min(3).max(1055),
    city: z.string().min(3).max(1055),
    country: z.string().min(3).max(1055),
});
router.post('/request-demo', validateDataMiddleWare(DemoRequestSchema), CreateDemoRequestController);
export { router as DemoRequestRouter };
