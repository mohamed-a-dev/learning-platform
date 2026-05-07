import { z } from "zod";

export const updateUserFormSchema = z.object({
    name: z.string().min(3, { message: "Name is too short" }).max(15, { message: "Name is too big" }),

    password: z.string().min(6, { message: "Password must be at least 6 characters" }).max(20, { message: "Password must be at most 20 characters" }),

    passwordConfirmation: z.string().min(6, { message: "Password confirmation must be at least 6 characters" }).max(20, { message: "Password confirmation must be at most 20 characters" }),

})