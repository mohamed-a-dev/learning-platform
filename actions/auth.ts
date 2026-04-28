'use server'
import { UserForm } from "@/types/user";
import { createUser } from "@/services/auth";
import { registerSchema } from "@/lib/auth/validation";
import { errorHandler } from "@/lib/prismaErrors";

const registerUser = async (_: any, formData: FormData) => {
    const form: UserForm = {
        name: String(formData.get("name") || ""),
        email: String(formData.get("email") || ""),
        password: String(formData.get("password") || ""),
        role: formData.get("role") as "student" | "instructor",
    };

    // validation before calling db
    const result = registerSchema.safeParse(form);
    if (!result.success)
        return { success: false, message: result.error.issues.map(err => err.message).join(", "), timestamp: Date.now() };

    // form data is valid 
    try {
        const user = await createUser(form);
        return { success: true, user, timestamp: Date.now() };
    } catch (error: any) {
        return errorHandler(error);
    }
}


export { registerUser };