import { prisma } from "../app.js";
import { ApiError } from "./ApiError.js";
import { verifyAccessTokenAdmin } from "./jwt.js";
export const AdminVerifyTokenMiddleware = async (req, res, next) => {
    try {
        const token = req.headers["authorization"]?.split(" ")[1];
        if (!token) {
            return res.status(401).json(new ApiError(401, "Unauthorized", "No token provided"));
        }
        const decodedToken = verifyAccessTokenAdmin(token);
        console.log('token is', decodedToken);
        if (!decodedToken?.id) {
            return res.status(401).json(new ApiError(401, "Unauthorized", "No token provided"));
        }
        const admin = await prisma.m05_user.findUnique({ where: { id: Number(decodedToken.id), deleted_at: null } });
        if (!admin) {
            return res.status(404).json(new ApiError(404, "Admin not found", "Employee not found"));
        }
        req.id = admin.id;
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(401).json(new ApiError(401, "Unauthorized", "No token provided"));
    }
};
