import { prisma } from "../../app.js";
import { ApiError } from "../../utils/ApiError.js";
import { generateAccessTokenAdmin, verifyAccessTokenAdmin } from "../../utils/jwt.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
export const AdminLoginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const admin = await prisma.admin.findUnique({ where: { email: email } });
        if (!admin) {
            return res.status(404).json(new ApiError(404, "Admin not found", "Admin not found"));
        }
        if (admin.password !== password) {
            return res.status(401).json(new ApiError(401, "Invalid Password", "Invalid Password"));
        }
        const accessToken = generateAccessTokenAdmin({ id: admin.id.toString() });
        return res.status(200).json({
            success: true,
            message: "Logged in successfully",
            access_token: accessToken,
            data: admin
        });
    }
    catch (error) {
        next(error);
    }
};
export const AdminVerifyTokenController = async (req, res, next) => {
    try {
        const token = req.headers["authorization"]?.split(" ")[1];
        if (!token) {
            return res.status(401).json(new ApiError(401, "Unauthorized", "No token provided"));
        }
        const decodedToken = verifyAccessTokenAdmin(token);
        if (!decodedToken?.id) {
            return res.status(401).json(new ApiError(401, "Unauthorized", "No token provided"));
        }
        const admin = await prisma.admin.findUnique({ where: { id: Number(decodedToken.id) } });
        if (!admin) {
            return res.status(404).json(new ApiError(404, "Admin not found", "Employee not found"));
        }
        return res.status(200).json(new ApiResponse(true, 200, "Admin verified successfully", admin));
    }
    catch (error) {
        next(error);
    }
};
