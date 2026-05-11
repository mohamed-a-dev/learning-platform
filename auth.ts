import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

const nextAuth = NextAuth({
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
                if (!credentials?.email || !credentials?.password) return null;

                const user = await prisma.user.findUnique({
                    where: { email: String(credentials.email) },
                });

                if (!user) return null;

                const isPasswordCorrect = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                );

                if (!isPasswordCorrect) return null;

                return user;
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user, trigger, session }) {
            // after login
            if (user) {
                token.role = user.role;
                token.gender = user.gender;
                token.id = user.id;
                token.name = user.name;
            }

            // when session.update()
            if (trigger === "update" && session) {
                if (session.name) token.name = session.name;
                if (session.role) token.role = session.role;
                if (session.gender) token.gender = session.gender;
            }

            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.user.gender = token.gender as string;
                session.user.name = token.name as string;
            }

            return session;
        },
    },
});

export const { auth, handlers, signIn, signOut } = nextAuth;