import { Router } from "express";
import { ListDemoRequestsController, MarkAsReadController, ReadDemoRequestController } from "../../controllers/user/demorequest.controller.js";
import { AdminVerifyTokenMiddleware } from "../../utils/authentication.js";
import { z } from "zod";
import { validateParamsMiddleWare } from "../../middlewares/zod.validation.middleware.js";
const router = Router();
const ListDemoRequestsSchema = z.object({
    page: z.string().refine((val) => {
        const num = Number(val);
        return !isNaN(num) && num > 0;
    }).default('1'),
    limit: z.string().refine((val) => {
        const num = Number(val);
        return !isNaN(num) && num > 0;
    }).default('10'),
    sort: z.enum([
        'created_at',
        'updated_at',
        'company_name',
        'industry',
        'web',
        'email',
        'contact_name',
        'designation',
        'mobile',
        'whatsapp',
        'product_interests',
        'company_description',
        'city',
        'country',
    ]).default('created_at'),
    order: z.enum(['asc', 'desc']).default('desc'),
});
router.get('/demo/demo-requests', validateParamsMiddleWare(ListDemoRequestsSchema), AdminVerifyTokenMiddleware, ListDemoRequestsController);
router.get('/demo/demo-request/:id', AdminVerifyTokenMiddleware, ReadDemoRequestController);
router.post('/demo/demo-request-mark-as-read/:id', AdminVerifyTokenMiddleware, MarkAsReadController);
export { router as AdminDemoRequestRouter };
