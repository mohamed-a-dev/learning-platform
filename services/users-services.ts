'use server'
import { getSessionUserInfo } from "@/lib/authorization";
import prisma from "@/lib/prisma"
import { UpdateUserData } from "@/types/user";

const updateUser = async (user: UpdateUserData) => {
    const { id: userId } = await getSessionUserInfo();

    const editedUser = await prisma.user.update({
        where: {
            id: userId
        },
        data: user
    })
    return editedUser;
}

export { updateUser }