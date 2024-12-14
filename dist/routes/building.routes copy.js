import { Router } from "express";
import { validateDataMiddleWare } from "../middlewares/zod.validation.middleware.js";
import { z } from "zod";
import { AdminVerifyTokenMiddleware } from "../utils/authentication.js";
import { buildingCreateController, buildingDeleteController, buildingListController, buildingReadController, buildingUpdateController } from "../controllers/building.controller.js";
import { uploadImages } from "../middlewares/multer.middleware.js";
const router = Router();
const verifyOTPSchema = z.object({
    email: z.string().email(),
    password: z.union([z.string(), z.number()]),
});
const buildingCreateSchema = z.object({
    m01_name: z.string().min(1).max(255),
    m01_address: z.string().min(1),
    m01_point_of_contact: z.string().optional(),
    m01_contact_no: z.string().max(50).optional(),
});
const buildingUpdateSchema = z.object({
    m01_name: z.string().min(1).max(255).optional(),
    m01_address: z.string().min(1).optional(),
    m01_point_of_contact: z.string().optional(),
    m01_contact_no: z.string().max(50).optional(),
});
router.get('/buildings-list', AdminVerifyTokenMiddleware, buildingListController);
router.post('/building-create', AdminVerifyTokenMiddleware, uploadImages.fields([{ name: 'm01_image', maxCount: 1 }]), validateDataMiddleWare(buildingCreateSchema), buildingCreateController);
router.put('/building-update/:id', AdminVerifyTokenMiddleware, uploadImages.fields([{ name: 'm01_image', maxCount: 1 }]), validateDataMiddleWare(buildingUpdateSchema), buildingUpdateController);
router.get('/building-read/:id', AdminVerifyTokenMiddleware, buildingReadController);
router.delete('/building-delete/:id', AdminVerifyTokenMiddleware, buildingDeleteController);
export { router as AdminBuildingRouter };
