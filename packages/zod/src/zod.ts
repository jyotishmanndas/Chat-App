import { z } from "zod";

export const signupSchema = z.object({
    email: z.string().email({ message: "Inavlid email address" }),
    name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(20, { message: "password must not exceed 20 characters" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" })
        .regex(/[@#$%&*!?]/, { message: "Password must contain at least one special chacracter" })
});

export const signinSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(20, { message: "Password must be at least 20 characters long" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" })
        .regex(/[@#$%&*!?]/, { message: "Password must contain at least one special chacracter" })
});

export const roomCreateSchema = z.object({
    slug: z.string().min(1).max(6)
});

export const chatInputSchema = z.object({
    message: z.string().min(1)
})