'use server'
import { UserForm } from "@/types/user";
import prisma from "@/lib/prisma";
import { Role } from "@/app/generated/prisma/enums";

const createUser = async (form: UserForm) => {
    const user = await prisma.user.create({ data: { ...form, role: form.role as Role } });
    return user;
}

export {createUser}