'use server'
import prisma from "@/lib/prisma";
import { Gender, Role } from "@/app/generated/prisma/enums";
import { CreateUserForm } from "@/types/user";

const createUser = async (form: CreateUserForm) => {
    const user = await prisma.user.create({ data: { ...form, role: form.role as Role, gender: form.gender as Gender } });
    return user;
}

export { createUser }