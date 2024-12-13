import { NextFunction, Request, Response } from "express";
import { prisma } from "../../app.js";
import { ApiError } from "../../utils/ApiError.js";
import { generateAccessTokenAdmin, verifyAccessTokenAdmin } from "../../utils/jwt.js";
import { ApiResponse } from "../../utils/ApiResponse.js";



export const UserLoginController = async (req: Request<{},{},{email: string, password: string}>, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const admin = await prisma.m05_user.findFirst({ where: { m05_email: email,deleted_at: null } });
        if (!admin) {
            return res.status(404).json(new ApiError(404, "Admin not found", "Admin not found"));
        }
        if (admin.m05_password !== password) {
            return res.status(401).json(new ApiError(401, "Invalid Password", "Invalid Password"));
        }
     
        const accessToken = generateAccessTokenAdmin({ id: admin.id.toString() });

        return res.status(200).json({
            success: true,
            message: "Logged in successfully",
            access_token: accessToken,
            data: admin
        });
    } catch (error) {
        next(error);
    }
};

export const UserVerifyTokenController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers["authorization"]?.split(" ")[1];
        if (!token) {
            return res.status(401).json(new ApiError(401, "Unauthorized", "No token provided"));
        }
        const decodedToken = verifyAccessTokenAdmin(token);
        if(!decodedToken?.id){
           return res.status(401).json(new ApiError(401, "Unauthorized", "No token provided")); 
        }
        const admin = await prisma.m05_user.findUnique({ where: {id: Number(decodedToken.id)} });
        if (!admin) {
            return res.status(404).json(new ApiError(404, "User not found", "User not found"));
        }
        
        return res.status(200).json(new ApiResponse(true, 200, "User verified successfully", admin));
    } catch (error) {
        next(error);
    }
};


export const userListController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await prisma.m05_user.findMany({
            where: { deleted_at: null },
            select: {
                id: true,
                m05_name: true,
                m05_contact: true,
                m05_email: true,
                created_at: true,
                updated_at: true
            },
        });

        return res.status(200).json(new ApiResponse(true, 200, "User list", users));
    } catch (error) {
        next(error);
    }
};


export const userCreateController = async (req: Request<{}, {}, { m05_name: string, m05_contact?: string, m05_email: string, m05_password: string }>, res: Response, next: NextFunction) => {
    try {
        const { m05_name, m05_contact, m05_email, m05_password } = req.body;

        const existingUser = await prisma.m05_user.findFirst({ where: { m05_email: m05_email,deleted_at: null } });
        if (existingUser) {
            return res.status(400).json(new ApiError(400, "Email already exists", "Email already exists"));
        }

        const newUser = await prisma.m05_user.create({
            data: {
                m05_name: m05_name,
                m05_contact: m05_contact || null,
                m05_email: m05_email,
                m05_password: m05_password,
            },
        });

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: newUser,
        });
    } catch (error) {
        next(error);
    }
};

export const userUpdateController = async (req: Request<{ id: string }, {},  { m05_name: string, m05_contact?: string, m05_email: string, m05_password: string }>, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { m05_name, m05_contact, m05_email, m05_password } = req.body;

        const user = await prisma.m05_user.findFirst({ where: { id: parseInt(id), deleted_at: null } });
        if (!user) {
            return res.status(404).json(new ApiError(404, "User not found", "User not found"));
        }

        const updatedUser = await prisma.m05_user.update({
            where: { id: parseInt(id) },
            data: {
                ...(m05_name && { m05_name: m05_name }),
                ...(m05_contact && { m05_contact: m05_contact }),
                ...(m05_email && { m05_email: m05_email }),
                ...(m05_password && { m05_password: m05_password }),
            },
        });

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: updatedUser,
        });
    } catch (error) {
        next(error);
    }
};


export const userReadController = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const user = await prisma.m05_user.findFirst({
            where: { id: parseInt(id), deleted_at: null },
            select: {
                id: true,
                m05_name: true,
                m05_contact: true,
                m05_email: true,
                created_at: true,
                updated_at: true,
            },
        });

        if (!user) {
            return res.status(404).json(new ApiError(404, "User not found", "User not found"));
        }

        return res.status(200).json({
            success: true,
            message: "User retrieved successfully",
            data: user,
        });
    } catch (error) {
        next(error);
    }
};


export const userDeleteController = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        // Check if the user exists and is not already deleted
        const user = await prisma.m05_user.findFirst({
            where: { id: parseInt(id), deleted_at: null },
        });

        if (!user) {
            return res.status(404).json(new ApiError(404, "User not found", "User not found"));
        }

        // Perform the soft delete
        await prisma.m05_user.update({
            where: { id: parseInt(id) },
            data: {
                deleted_at: new Date(),
            },
        });

        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};
