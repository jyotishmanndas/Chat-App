import { prisma } from "@workspace/db/prisma";
import { roomCreateSchema } from "@workspace/zod-validator/zod"
import { Request, Response } from "express"

export const roomCreate = async (req: Request, res: Response) => {
    try {
        const profileCheck = await prisma.user.findUnique({
            where: { id: req.userId }
        });

        if (!profileCheck) {
            return res.status(400).json({ msg: "User not found" })
        };

        const existingRoom = await prisma.room.findFirst({
            where: { slug: req.body.slug }
        })

        if (existingRoom) {
            return res.status(401).json({ msg: "This room is already exists" })
        }
        const result = roomCreateSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({ msg: "Invalid room data" })
        };

        const userId = req.userId;
        const createRoom = await prisma.room.create({
            data: {
                slug: result.data.slug,
                userId: userId || ""
            }
        });
        return res.status(200).json({
            msg: "Room created successfully", room: {
                id: createRoom.id,
                slug: createRoom.slug,
                cretedAt: createRoom.createdAt
            }
        })
    } catch (error) {
        return res.status(500).json({ msg: "Interal server error" })
    }
};

export const joinRoom = async (req: Request, res: Response) => {
    try {
        const profileCheck = await prisma.user.findUnique({
            where: { id: req.userId }
        });

        if (!profileCheck) {
            return res.status(400).json({ msg: "User not found" })
        };

        const room = await prisma.room.findFirst({
            where: { slug: req.params.id }
        });

        if (!room) {
            return res.status(404).json({ msg: "No such room is found" })
        };

        return res.status(200).json({
            room: {
                id: room.id,
                slug: room.slug
            }
        })
    } catch (error) {
        return res.status(500).json({ msg: "Interal server error" })
    }
}
