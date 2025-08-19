"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { roomCreateSchema } from "@workspace/zod-validator/zod";
import axios from "axios";
import { Copy, CopyCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export function JoinRoomForm() {
    const [showRoomId, setRoomId] = useState("");
    const [toogle, setToogle] = useState(false);
    const router = useRouter();
    const form = useForm<z.infer<typeof roomCreateSchema>>({
        resolver: zodResolver(roomCreateSchema),
        defaultValues: {
            slug: ""
        },
    });
    async function onSubmit(values: z.infer<typeof roomCreateSchema>) {
        try {
            const res = await axios.post("http://localhost:3001/room/create", { slug: values.slug }, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            });
            form.reset();
            toast.success("Room created successfully");
            router.push(`/chat/${res.data.room.slug}`)
        } catch (error) {
            console.log(error);
            toast("Something went wrong")
        }
    };

    const randomRoomId = () => {
        const values = "QWERTYUIOPASDFGHJKLZXCVBNM1234567890";
        let roomId = "";
        for (let i = 0; i < 6; i++) {
            const x = Math.floor(Math.random() * 36);
            roomId += values[x]
        }
        setRoomId(roomId)
    };

    const copyRoomId = () => {
        setToogle(true);
        navigator.clipboard.writeText(showRoomId);

        setTimeout(() => {
            setToogle(false)
        }, 2000)
    };
    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className=" flex items-center gap-5">
                    <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input className="w-84" placeholder="shadcn" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-fit cursor-pointer">Join room</Button>
                </form>
            </Form>
            <Button className="w-full mt-5 cursor-pointer" onClick={randomRoomId}>Create a new Room</Button>

            {showRoomId && (
                <div className="flex flex-col items-center justify-center mt-5 bg-accent py-3 rounded-lg">
                    <p className="text-center">Share this code with your friend</p>
                    <div className="flex items-center justify-center gap-5">
                        <span className="font-bold text-2xl">{showRoomId}</span>
                        <button className="cursor-pointer" onClick={copyRoomId}>
                            {toogle ? (
                                <CopyCheck className="w-5 h-5" />
                            ) : (
                                <Copy className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}