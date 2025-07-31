import express, { Request, Response } from "express";
import { signupSchema } from "@workspace/zod-validator/zod";
import { prisma } from "@workspace/db/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());

app.post("/signup", async (req: Request, res: Response) => {
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
        const token = await jwt.sign({ userId }, "12345");
        return res.status(200).json({
            token,
            msg: "user created successfully"
        })
    } catch (error) {
        return res.status(500).json({
            msg: "Internal server error"
        })
    }
});

app.listen(3000, () => {
    console.log("Server is running on the port 3000");
});