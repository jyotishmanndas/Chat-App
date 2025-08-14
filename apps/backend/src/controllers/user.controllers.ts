import { Request, Response } from "express";
import { prisma } from "@workspace/db/prisma";
import { signinSchema, signupSchema } from "@workspace/zod-validator/zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const userSignUp = async (req: Request, res: Response) => {
    const result = signupSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            msg: "Invalid inputs"
        })
    };

    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                email: result.data.email
            }
        });
        if (existingUser) {
            return res.status(400).json({
                msg: "user already exists with this email"
            })
        };

        const hashedPassword = await bcrypt.hash(result.data.password, 12);
        const signupUser = await prisma.user.create({
            data: {
                name: result.data.name,
                email: result.data.email,
                password: hashedPassword,
                emailVerified: new Date()
            }
        });

        const userId = signupUser.id;
        const token = jwt.sign({ userId }, "12345");
        return res.status(200).json({
            token,
            msg: "user created successfully"
        })
    } catch (error) {
        return res.status(500).json({
            msg: "Internal server error"
        })
    }
};

export const userSignIn = async (req: Request, res: Response) => {
    const result = signinSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            msg: "Invalid inputs"
        })
    };

    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                email: result.data.email
            }
        });
        if (!existingUser) {
            return res.status(400).json({
                msg: "user does not exist with this email"
            })
        };

        const isPasswordValid = await bcrypt.compare(result.data.password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                msg: "Invalid password"
            })
        };

        const userId = existingUser.id;
        const token = jwt.sign({ userId }, "12345");
        return res.status(200).json({
            token,
            msg: "User signup successfully"
        });
    } catch (error) {
        return res.status(500).json({
            msg: "Internal server error"
        });
    }
};

export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true
            }
        });

        if (!user) {
            return res.status(404).json({
                msg: "User not found"
            });
        };

        return res.status(200).json({
            user,
            msg: "User found successfully"
        });
    } catch (error) {
        return res.status(500).json({
            msg: "Internal server error"
        });
    }
};