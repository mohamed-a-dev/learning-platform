import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import bcrypt from "bcrypt"
import prisma from "@/lib/prisma"

const nextAuth = NextAuth(
    {
        secret: process.env.AUTH_SECRET,
        adapter: PrismaAdapter(prisma),
        session: { strategy: "jwt" },

        providers: [
            Credentials({
                name: "credentials",
                credentials: {
                    email: {},
                    password: {},
                },

                async authorize(credentials) {
                    const user = await prisma.user.findUnique({
                        where: { email: String(credentials?.email) },
                    })
                    
                    if (!user)
                        return null

                    // const isPasswordCorrect = await bcrypt.compare(
                    //     credentials?.password as string,
                    //     user.password as string
                    // )

                    if (user.password !== credentials.password)
                        return null
                    return user
                },
            }),
        ],
    }
)

export const { auth, handlers, signIn, signOut } = nextAuth