'use server'

import { auth } from "@/auth"

export const getSessionUserInfo = async () => {
    const session = await auth();
    return { id: session?.user.id, role: session?.user.role };
}


export const assertRole = async (allowedRole: string) => {
    const { role } = await getSessionUserInfo();

    if (role !== allowedRole)
        throw { code: "FORBIDDEN", message: "Not authorized to do this action" };
};