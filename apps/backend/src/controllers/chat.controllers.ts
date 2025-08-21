import { prisma } from "@workspace/db/prisma";
import { chatInputSchema } from "@workspace/zod-validator/zod";
import { Request, Response } from "express";

export const ChatMessage = async (req: Request, res: Response) => {
    try {
        const profile = await prisma.user.findUnique({
            where: { id: req.userId }
        })
        if (!profile) {
            return res.status(404).json({ msg: "user not found" })
        };

        const room = await prisma.room.findUnique({
            where: { slug: req.body.slug },
            include: { members: true }
        })
        if (!room) {
            return res.status(404).json({ msg: "Room not found" })
        }

        // const result = chatInputSchema.safeParse(req.body);
        // if (!result.success) {
        //     return res.status(400).json({ msg: "Inavalid input" })
        // };

        const member = room.members.find(m => m.userId === profile.id);
        if (!member) {
            return res.status(403).json({ msg: "You are not a member of this room" });
        };

        const message = await prisma.chatMessage.create({
            data: {
                message: req.body.message,
                userId: profile.id,
                memberId: member.id
            }
        })
        return res.status(200).json({ msg: "Message sent", message })
    } catch (error) {
        return res.status(500).json({ msg: "Internal error" })
    }
};

export const getRoomMessage = async (req: Request, res: Response) => {
    try {
        const profile = await prisma.user.findUnique({
            where: { id: req.userId }
        })
        if (!profile) {
            return res.status(404).json({ msg: "user not found" })
        };

        const room = await prisma.room.findUnique({
            where: { slug: req.params.id },
            include: { members: true }
        });
        if (!room) {
            return res.status(404).json({ msg: "room not found" })
        };

        const member = room.members.find(m => m.userId === profile.id);
        if (!member) {
            return res.status(403).json({ msg: "You are not a member of this room" });
        }
        const message = await prisma.chatMessage.findMany({
            where: {
                member: {
                    roomId: member.roomId
                }
            },
            include: {
                User: true,
                member: true
            },
            orderBy: {
                createdAt: "asc"
            }
        })
        return res.status(200).json(message)
    } catch (error) {
        return res.status(500).json({ msg: "Internal error" })
    }
}