"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signupSchema } from "@workspace/zod-validator/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { useState } from "react";
import { Eye, EyeOff, Loader } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function SignUpForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const form = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            email: "",
            password: "",
            name: ""
        },
    });

    const tooglePassword = () => {
        setShowPassword((prev) => !prev);
    };
    async function onSubmit(values: z.infer<typeof signupSchema>) {
        try {
            setLoading(true);
            const res = await axios.post("http://localhost:3000/signup", values);
            const token = res.data.token;
            if (token) {
                localStorage.setItem("token", token);
                form.reset();
                toast.success("Signup successful");
                router.push("/dashboard");
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 400) {
                form.setError("email", {
                    type: "manual",
                    message: "Email already exists"
                })
            } else {
                toast("Uh oh! Something went wrong.", {
                    description: "There was a problem with your request.",
                })
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-sm text-balance">
                    Enter your details below to create a new account
                </p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="johndoe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="john@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input type={showPassword ? "text" : "password"} placeholder="abAb12@#" {...field} />
                                            <button type="button" onClick={tooglePassword} className="absolute right-2 top-2 text-gray-400">
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button type="submit" className="w-full cursor-pointer">
                        {loading ? (
                            <Loader className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                Submit
                            </>
                        )}
                    </Button>
                    <div className="text-center text-sm">
                        Have an account?{" "}
                        <a href="/login" className="underline underline-offset-4">
                            Log in
                        </a>
                    </div>
                </form>
            </Form>
        </div>
    )
}