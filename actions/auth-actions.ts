'use server'
import { createUser } from "@/services/auth-services";
import { errorHandler } from "@/lib/prismaErrors";
import { registerSchema } from "@/lib/validation/auth-validation";
import { CreateUserForm } from "@/types/user";

const registerUser = async (_: any, formData: FormData) => {
    const form: CreateUserForm = {
        name: String(formData.get("name") || ""),
        email: String(formData.get("email") || ""),
        password: String(formData.get("password") || ""),
        role: formData.get("role") as "student" | "instructor",
        gender: formData.get("gender") as "male" | "female",
    };

    // validation before calling db
    const result = registerSchema.safeParse(form);
    if (!result.success)
        return { success: false, message: result.error.issues.map(err => err.message).join(", "), timestamp: Date.now() };

    // form data is valid 
    try {
        await createUser(form);
        return { success: true, message: 'created successfully', timestamp: Date.now() };
    } catch (error: any) {
        return errorHandler(error);
    }
}


export { registerUser };