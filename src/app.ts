import { PrismaClient } from '@prisma/client';
import cookieParser from "cookie-parser";
import cors from 'cors';
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import { errorHandlingMiddleware } from "./middlewares/errorHandling.middleware.js";
import { AdminAuthenticationRouter } from "./routes/user/authentication.routes.js";
import { TestRouter } from "./routes/test.routes.js";
import { AdminBuildingRouter } from './routes/building.routes.js';
dotenv.config();

export const prisma = new PrismaClient();


const allowedOrigins = process.env.CORS_ORIGIN!.split(',');

const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g., server-to-server requests) or if origin is in allowedOrigins
        if (!origin || allowedOrigins.includes(origin.trim())) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    exposedHeaders:['Authorization'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};


// configures dotenv to work in your application
const app = express();

app.use(cookieParser())
app.use(cors(corsOptions))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Configure express-session with default in-memory store
app.use(
    session({
        secret: process.env.SESSION_STORE_SECRET!, // Replace with a strong secret in production
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 5 * 60 * 1000 }, // Session expires in 5 minutes
    })
);


app.use('/test',TestRouter)

app.use('/api/user',
    AdminAuthenticationRouter,
    AdminBuildingRouter
)





app.use(errorHandlingMiddleware)



export { app };

