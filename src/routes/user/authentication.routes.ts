import { Router } from "express";
import { validateDataMiddleWare } from "../../middlewares/zod.validation.middleware.js";
import { userCreateController, userDeleteController, userListController, UserLoginController, userReadController, userUpdateController, UserVerifyTokenController } from "../../controllers/user/authentication.controller.js";
import { z } from "zod";
import { AdminVerifyTokenMiddleware } from "../../utils/authentication.js";

const router = Router();


const verifyOTPSchema = z.object({
    email: z.string().email(),
    password: z.union([z.string(), z.number()]),
});

const userCreateSchema = z.object({
    m05_name: z.string().min(1).max(100),
    m05_contact: z.string().max(50).optional(),
    m05_email: z.string().email().max(100).optional(),
    m05_password: z.string().min(4).max(100),
});
const userUpdateSchema = z.object({
    m05_name: z.string().min(1).max(100).optional(),
    m05_contact: z.string().max(50).optional(),
    m05_email: z.string().email().max(100).optional(),
    m05_password: z.string().min(4).max(100).optional(),
});

router.post('/login',validateDataMiddleWare(verifyOTPSchema),UserLoginController);
router.post('/verify-token',UserVerifyTokenController);
router.get('/users-list',AdminVerifyTokenMiddleware,userListController);
router.post('/user-create',AdminVerifyTokenMiddleware,validateDataMiddleWare(userCreateSchema),userCreateController);
router.put('/user-update/:id',AdminVerifyTokenMiddleware,validateDataMiddleWare(userUpdateSchema),userUpdateController);
router.get('/user-read/:id',AdminVerifyTokenMiddleware,userReadController);
router.delete('/user-delete/:id',AdminVerifyTokenMiddleware,userDeleteController);


export { router as AdminAuthenticationRouter };
