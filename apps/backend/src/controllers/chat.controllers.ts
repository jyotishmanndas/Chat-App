// import { prisma } from "@workspace/db/prisma";
// import { chatInputSchema } from "@workspace/zod-validator/zod";
// import { Request, Response } from "express";

// export const ChatMessage = async (req: Request, res: Response) => {
//     try {
//         const profile = await prisma.user.findUnique({
//             where: { id: req.userId }
//         })
//         if (!profile) {
//             return res.status(400).json({ msg: "user not found" })
//         };

//         const room = await prisma.room.findUnique({
//             where: { slug: req.body.slug }
//         })
//         if (!room) {
//             return res.status(400).json({ msg: "Room not found" })
//         }

//         // const result = chatInputSchema.safeParse(req.body);
//         // if (!result.success) {
//         //     return res.status(400).json({ msg: "Inavalid input" })
//         // };
//         const message = await prisma.chatMessage.create({
//             data: {
//                 message: req.body.message,
//                 userId: profile.id,
//                 roomId: room.id
//             }
//         })
//         return res.status(200).json({ msg: "Message sent", message })

//     } catch (error) {

//     }
// };

// export const getRoomMessage = async (req: Request, res: Response) => {
//     try {
//         const profile = await prisma.user.findUnique({
//             where: { id: req.userId }
//         })
//         if (!profile) {
//             return res.status(400).json({ msg: "user not found" })
//         };

//         const room = await prisma.room.findFirst({
//             where: { slug: req.params.id }
//         });
//         if (!room) {
//             return res.status(401).json({ msg: "room not found" })
//         }
//         const message = await prisma.chatMessage.findMany({
//             where: {
//                 roomId: room.id,
//             }
//         })
//         return res.status(200).json(message)
//     } catch (error) {
//         console.log(error);
//     }
// }