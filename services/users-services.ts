'use server'
import { getSessionUserInfo } from "@/lib/authorization";
import prisma from "@/lib/prisma"
import { UpdateUserData } from "@/types/user";
import bcrypt from "bcrypt";

const updateUser = async (user: UpdateUserData) => {
    const { id: userId } = await getSessionUserInfo();
    const hashedPassword = await bcrypt.hash(user.password, 10);


    const editedUser = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            name: user.name,
            password: hashedPassword
        }
    })
    return editedUser;
}

export { updateUser }