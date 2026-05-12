'use server'
import prisma from "@/lib/prisma";
import { Gender, Role } from "@/app/prisma/enums";
import { CreateUserForm } from "@/types/user";
import bcrypt from "bcrypt";

const createUser = async (form: CreateUserForm) => {
    const hashedPassword = await bcrypt.hash(form.password, 10);
    const user = await prisma.user.create({ data: { ...form, password: hashedPassword, role: form.role as Role, gender: form.gender as Gender } });
    return user;
}

export { createUser }