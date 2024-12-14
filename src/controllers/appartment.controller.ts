import { NextFunction, Request, Response } from "express";
import { prisma } from "../app.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// List Apartments
export const apartmentListController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const apartments = await prisma.m02_appartment.findMany({
            where: { deleted_at: null },
            select: {
                id: true,
                m02_m01_building_id: true,
                m02_door_no: true,
                m02_image: true,
                m02_floor: true,
                m02_name: true,
                created_at: true,
                updated_at: true,
            },
        });

        return res.status(200).json(new ApiResponse(true, 200, "Apartment list", apartments));
    } catch (error) {
        next(error);
    }
};

// Create Apartment
export const apartmentCreateController = async (
    req: Request<{}, {}, { m02_m01_building_id: number; m02_door_no?: string; m02_image?: string; m02_floor?: number; m02_name: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const { m02_m01_building_id, m02_door_no, m02_floor, m02_name } = req.body;
        const image_path = ((req.files as any)?.m02_image?.[0] as Express.Multer.File)?.path || null;

        const newApartment = await prisma.m02_appartment.create({
            data: {
                m02_m01_building_id,
                m02_door_no: m02_door_no || null,
                m02_image: image_path || null,
                m02_floor: m02_floor || null,
                m02_name,
            },
        });

        return res.status(201).json({
            success: true,
            message: "Apartment created successfully",
            data: newApartment,
        });
    } catch (error) {
        console.log(error)
        next(error);
    }
};

// Update Apartment
export const apartmentUpdateController = async (
    req: Request<{ id: string }, {}, { m02_m01_building_id?: number; m02_door_no?: string; m02_image?: string; m02_floor?: number; m02_name?: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const { m02_m01_building_id, m02_door_no, m02_floor, m02_name } = req.body;
        const image_path = ((req.files as any)?.m02_image?.[0] as Express.Multer.File)?.path || null;

        const apartment = await prisma.m02_appartment.findFirst({ where: { id: parseInt(id), deleted_at: null } });
        if (!apartment) {
            return res.status(404).json(new ApiError(404, "Apartment not found", "Apartment not found"));
        }

        const updatedApartment = await prisma.m02_appartment.update({
            where: { id: parseInt(id) },
            data: {
                ...(m02_m01_building_id && { m02_m01_building_id }),
                ...(m02_door_no && { m02_door_no }),
                ...(image_path && { m02_image: image_path }),
                ...(m02_floor && { m02_floor }),
                ...(m02_name && { m02_name }),
            },
        });

        return res.status(200).json({
            success: true,
            message: "Apartment updated successfully",
            data: updatedApartment,
        });
    } catch (error) {
        next(error);
    }
};

// Get Apartment by ID
export const apartmentReadController = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const apartment = await prisma.m02_appartment.findFirst({
            where: { id: parseInt(id), deleted_at: null },
            select: {
                id: true,
                m02_m01_building_id: true,
                m02_door_no: true,
                m02_image: true,
                m02_floor: true,
                m02_name: true,
                created_at: true,
                updated_at: true,
            },
        });

        if (!apartment) {
            return res.status(404).json(new ApiError(404, "Apartment not found", "Apartment not found"));
        }

        return res.status(200).json({
            success: true,
            message: "Apartment retrieved successfully",
            data: apartment,
        });
    } catch (error) {
        next(error);
    }
};

// Soft Delete Apartment
export const apartmentDeleteController = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const apartment = await prisma.m02_appartment.findFirst({
            where: { id: parseInt(id), deleted_at: null },
        });

        if (!apartment) {
            return res.status(404).json(new ApiError(404, "Apartment not found", "Apartment not found"));
        }

        await prisma.m02_appartment.update({
            where: { id: parseInt(id) },
            data: {
                deleted_at: new Date(),
            },
        });

        return res.status(200).json({
            success: true,
            message: "Apartment deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};
