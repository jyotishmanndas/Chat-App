import { prisma } from "@workspace/db/prisma";
import { roomCreateSchema } from "@workspace/zod-validator/zod"
import { Request, Response } from "express"

export const roomCreate = async (req: Request, res: Response) => {
    const result = roomCreateSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            msg: "Invalid room data"
        })
    };

    const userId = req.userId;
    const createRoom = await prisma.room.create({
        data: {
            slug: result.data.slug,
            userId: userId || ""
        }
    });
    return res.status(200).json({
        msg: "Room created successfully",
        createRoom
    })
}