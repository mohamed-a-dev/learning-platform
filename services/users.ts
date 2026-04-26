'use server'
import prisma from "@/lib/prisma"
import { EditUser } from "@/types/user"

const updateUser = async (user: EditUser, userId: string) => {
    const editedUser = await prisma.user.update({
        where: {
            id: userId
        },
        data: user
    })    
    return editedUser;
}

export {updateUser}