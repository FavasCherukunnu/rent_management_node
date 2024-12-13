import { prisma } from "../../app.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
export const CreateDemoRequestController = async (req, res, next) => {
    try {
        const { company_name, industry, web, email, contact_name, designation, mobile, whatsapp, product_interests, company_description, city, country, } = req.body;
        // Validation (example: check for required fields)
        if (!company_name || !email || !contact_name || !mobile) {
            return res
                .status(400)
                .json(new ApiError(400, "Bad Request", "Missing required fields"));
        }
        // Create a new demo request in the database
        const newDemoRequest = await prisma.demoRequest.create({
            data: {
                company_name,
                industry,
                web,
                email,
                contact_name,
                designation,
                mobile,
                whatsapp,
                product_interests,
                company_description,
                city,
                country,
                is_read: false, // Default value for new demo requests
            },
        });
        // Respond with the created demo request
        return res
            .status(201)
            .json(new ApiResponse(true, 201, "Demo request created successfully", newDemoRequest));
    }
    catch (error) {
        next(error); // Pass errors to the global error handler
    }
};
