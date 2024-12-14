import { prisma } from "../app.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
export const buildingListController = async (req, res, next) => {
    try {
        const buildings = await prisma.m01_building.findMany({
            where: { deleted_at: null },
            select: {
                id: true,
                m01_name: true,
                m01_address: true,
                m01_point_of_contact: true,
                m01_image: true,
                m01_contact_no: true,
                created_at: true,
                updated_at: true,
            },
        });
        return res.status(200).json(new ApiResponse(true, 200, "Building list", buildings));
    }
    catch (error) {
        next(error);
    }
};
export const buildingCreateController = async (req, res, next) => {
    try {
        const { m01_name, m01_address, m01_point_of_contact, m01_contact_no } = req.body;
        const image_path = req.files?.m01_image?.[0]?.path || null;
        const newBuilding = await prisma.m01_building.create({
            data: {
                m01_name,
                m01_address,
                m01_point_of_contact: m01_point_of_contact || null,
                m01_image: image_path || null,
                m01_contact_no: m01_contact_no || null,
            },
        });
        return res.status(201).json({
            success: true,
            message: "Building created successfully",
            data: newBuilding,
        });
    }
    catch (error) {
        next(error);
    }
};
export const buildingUpdateController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { m01_name, m01_address, m01_point_of_contact, m01_image, m01_contact_no } = req.body;
        const image_path = req.files?.m01_image?.[0]?.path || null;
        const building = await prisma.m01_building.findFirst({ where: { id: parseInt(id), deleted_at: null } });
        if (!building) {
            return res.status(404).json(new ApiError(404, "Building not found", "Building not found"));
        }
        const updatedBuilding = await prisma.m01_building.update({
            where: { id: parseInt(id) },
            data: {
                ...(m01_name && { m01_name }),
                ...(m01_address && { m01_address }),
                ...(m01_point_of_contact && { m01_point_of_contact }),
                ...(image_path && { m01_image: image_path }),
                ...(m01_contact_no && { m01_contact_no }),
            },
        });
        return res.status(200).json({
            success: true,
            message: "Building updated successfully",
            data: updatedBuilding,
        });
    }
    catch (error) {
        next(error);
    }
};
export const buildingReadController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const building = await prisma.m01_building.findFirst({
            where: { id: parseInt(id), deleted_at: null },
            select: {
                id: true,
                m01_name: true,
                m01_address: true,
                m01_point_of_contact: true,
                m01_image: true,
                m01_contact_no: true,
                created_at: true,
                updated_at: true,
            },
        });
        if (!building) {
            return res.status(404).json(new ApiError(404, "Building not found", "Building not found"));
        }
        return res.status(200).json({
            success: true,
            message: "Building retrieved successfully",
            data: building,
        });
    }
    catch (error) {
        next(error);
    }
};
export const buildingDeleteController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const building = await prisma.m01_building.findFirst({
            where: { id: parseInt(id), deleted_at: null },
        });
        if (!building) {
            return res.status(404).json(new ApiError(404, "Building not found", "Building not found"));
        }
        await prisma.m01_building.update({
            where: { id: parseInt(id) },
            data: {
                deleted_at: new Date(),
            },
        });
        return res.status(200).json({
            success: true,
            message: "Building deleted successfully",
        });
    }
    catch (error) {
        next(error);
    }
};
