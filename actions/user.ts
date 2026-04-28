'use server'
import { errorHandler } from "@/lib/prismaErrors";
import { updateUser } from "@/services/users"
import { EditUser } from "@/types/user"


const updateUserAction = async (user: EditUser, userId: string) => {
    try {
        const editedUser = await updateUser(user, userId);
        return { success: true, editedUser }
    } catch (error: any) {
        return errorHandler(error);
    }
}

export { updateUserAction }