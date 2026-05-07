import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(2, { message: "Name is too short" }).max(15, { message: "Name is to big" }),

    email: z.email({ message: "Invalid email" }),

    password: z.string().min(6, { message: "Password must be at least 6 characters" }).max(20, { message: "Password must be at most 20 characters" }),

    role: z.enum(["student", "instructor"]).default("student"),

    gender: z.enum(["male", "female"]),
});


export const loginSchema = z.object({
    email: z.email({ message: "Invalid email" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }).max(20, { message: "Password must be at most 20 characters" }),
});
