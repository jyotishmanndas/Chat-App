import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
};

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization || "";
    if (!token) {
        return res.status(400).json({
            msg: "No token provided"
        })
    };

    try {
        const decoded = jwt.verify(token, "12345") as { userId: string };

        if (decoded.userId) {
            req.userId = decoded.userId;
            next();
        }
    } catch (error) {
        return res.status(401).json({ msg: "Permission denied" })
    }
};