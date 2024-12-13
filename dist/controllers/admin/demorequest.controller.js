import { PrismaClient } from "@prisma/client";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
const prisma = new PrismaClient();
export const ListDemoRequestsController = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, sort = "created_at", order = "desc" } = req.query;
        console.log('second');
        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(limit, 10);
        const sortField = sort;
        const sortOrder = order === "asc" ? "asc" : "desc";
        // Fetch total count for pagination
        const totalCount = await prisma.demoRequest.count();
        // Fetch paginated and sorted demo requests
        const demoRequests = await prisma.demoRequest.findMany({
            where: {
                deleted_at: null,
            },
            skip: (pageNumber - 1) * pageSize,
            take: pageSize,
            orderBy: {
                [sortField]: sortOrder,
            },
        });
        return res.status(200).json(new ApiResponse(true, 200, "Demo requests fetched successfully", {
            total: totalCount,
            page: pageNumber,
            limit: pageSize,
            data: demoRequests,
        }));
    }
    catch (error) {
        console.log('error is coming', error);
        next(error);
    }
};
export const ReadDemoRequestController = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Validate ID
        const demoRequestId = parseInt(id, 10);
        if (isNaN(demoRequestId)) {
            return res
                .status(400)
                .json(new ApiError(400, "Bad Request", "Invalid ID parameter"));
        }
        // Find demo request by ID
        const demoRequest = await prisma.demoRequest.findUnique({
            where: { id: demoRequestId, deleted_at: null },
        });
        if (!demoRequest) {
            return res
                .status(404)
                .json(new ApiError(404, "Not Found", "Demo request not found"));
        }
        return res
            .status(200)
            .json(new ApiResponse(true, 200, "Demo request fetched successfully", demoRequest));
    }
    catch (error) {
        next(error);
    }
};
export const MarkAsReadController = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Validate ID
        const demoRequestId = parseInt(id, 10);
        if (isNaN(demoRequestId)) {
            return res
                .status(400)
                .json(new ApiError(400, "Bad Request", "Invalid ID parameter"));
        }
        // Find the demo request by ID (and ensure it is not soft-deleted)
        const demoRequest = await prisma.demoRequest.findFirst({
            where: {
                id: demoRequestId,
                deleted_at: null, // Ensure the record is not soft-deleted
            },
        });
        if (!demoRequest) {
            return res
                .status(404)
                .json(new ApiError(404, "Not Found", "Demo request not found"));
        }
        // Update the is_read field
        const updatedDemoRequest = await prisma.demoRequest.update({
            where: { id: demoRequestId },
            data: { is_read: true },
        });
        return res
            .status(200)
            .json(new ApiResponse(true, 200, "Demo request marked as read successfully", updatedDemoRequest));
    }
    catch (error) {
        next(error);
    }
};
