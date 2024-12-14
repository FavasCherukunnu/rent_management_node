import { ApiError } from '../utils/ApiError.js';
import { Prisma } from '@prisma/client';
export const errorHandlingMiddleware = (err, req, res, next) => {
    let errors = err.errors ? err.errors : {};
    let validationErrors = [];
    // mongoo validation error
    // if(typeof err.stack === 'string' && err.stack.includes('ValidationError:')){
    //     console.log('first')
    //     console.log(errors)
    //     validationErrors = Object.entries<any>(err.errors).map(([key, { message }]) => ({key, message}));
    //     // return res.json(new ApiError(err.statusCode||500, err.message||'Internal Server Error', errors, err.stack||''));
    // }
    // Check if the error is a Prisma validation error
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle unique constraint errors (for example: trying to insert a duplicate value)
        if (err.code === 'P2002') {
            const field = err.meta?.target ? err.meta.target : 'Unknown field';
            validationErrors.push({ key: field, message: `${field} already exists.` });
        }
    }
    // Check for Prisma validation errors (e.g., incorrect query structure)
    if (err instanceof Prisma.PrismaClientValidationError) {
        validationErrors.push({ key: 'ValidationError', message: err.message });
    }
    // If the error is a validation error from Prisma, add the specific details
    if (err instanceof Prisma.PrismaClientValidationError) {
        validationErrors.push({ key: 'ValidationError', message: err.message });
    }
    res.status(err.statusCode || 500).json(new ApiError(err.statusCode || 500, err.message || 'Internal Server Error', errors || 'Internal Server Error', err.stack || '', validationErrors));
};
