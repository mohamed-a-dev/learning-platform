'use server'
import { errorHandler } from "@/lib/prismaErrors";
import { updateUserFormSchema } from "@/lib/validation/user-validation";
import { updateUser } from "@/services/users-services"
import { EditUserForm } from "@/types/user"


const updateUserAction = async (formData: FormData) => {
    // coming from form
    const userFormData: EditUserForm = {
        name: String(formData.get('name')),
        password: String(formData.get('password')),
        passwordConfirmation: String(formData.get('passwordConfirmation')),
    }

    const { name, password, passwordConfirmation } = userFormData;

    // data that will go to db
    const userUpdateData = {
        name,
        password,
    }

    const result = updateUserFormSchema.safeParse(userFormData);
    if (!result.success)
        return { success: false, message: result.error.issues.map(err => err.message).join(", "), timestamp: Date.now() };

    if (password !== passwordConfirmation)
        return { success: false, message: "Passwords don't match", timestamp: Date.now() }

    try {
        const editedUser = await updateUser(userUpdateData);
        return { success: true, message: 'Updated Successfully', timestamp: Date.now() }
    } catch (error: any) {
        return errorHandler(error);
    }
}

export { updateUserAction }