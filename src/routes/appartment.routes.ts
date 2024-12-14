import { Router } from "express";
import { validateDataMiddleWare } from "../middlewares/zod.validation.middleware.js";
import { userCreateController, userDeleteController, userListController, UserLoginController, userReadController, userUpdateController, UserVerifyTokenController } from "../controllers/user/authentication.controller.js";
import { z } from "zod";
import { AdminVerifyTokenMiddleware } from "../utils/authentication.js";
import { buildingCreateController, buildingDeleteController, buildingListController, buildingReadController, buildingUpdateController } from "../controllers/building.controller.js";
import { uploadImages } from "../middlewares/multer.middleware.js";
import { apartmentCreateController, apartmentDeleteController, apartmentListController, apartmentReadController, apartmentUpdateController } from "../controllers/appartment.controller.js";

const router = Router();



const apartmentCreateSchema = z.object({
    m02_m01_building_id: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
    m02_door_no: z.string().max(50).optional(),
    m02_floor: z.union([z.number().int(), z.string().regex(/^\d+$/)]).optional(),
    m02_name: z.string().min(1).max(255),
});
const apartmentUpdateSchema = z.object({
    m02_m01_building_id: z.union([z.number().int(), z.string().regex(/^\d+$/)]).optional(),
    m02_door_no: z.string().max(50).optional(),
    m02_floor: z.union([z.number().int(), z.string().regex(/^\d+$/)]).optional(),
    m02_name: z.string().min(1).max(255).optional(),
});


router.get('/appartments-list',AdminVerifyTokenMiddleware,apartmentListController);
router.post('/appartment-create',AdminVerifyTokenMiddleware,
    uploadImages.fields([{ name: 'm02_image', maxCount: 1 }])
    ,validateDataMiddleWare(apartmentCreateSchema),apartmentCreateController);
router.put('/appartment-update/:id',AdminVerifyTokenMiddleware,
    uploadImages.fields([{ name: 'm02_image', maxCount: 1 }]),
    validateDataMiddleWare(apartmentUpdateSchema),apartmentUpdateController);
router.get('/appartment-read/:id',AdminVerifyTokenMiddleware,apartmentReadController);
router.delete('/appartment-delete/:id',AdminVerifyTokenMiddleware,apartmentDeleteController);


export { router as AdminAppartmentRouter };
