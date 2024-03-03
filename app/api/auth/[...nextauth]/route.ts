import { AuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prismaSingleton";
import { compare } from "bcrypt";


export const authOptions : AuthOptions = {
    pages: {
      signIn: "/Login",
      newUser: "/Register",
      signOut: "/SignOut"
    },
    session: { strategy: "jwt"},
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "email@example.com"},
                password: { label: "Password", type: "password"}
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where : {
                        email : credentials.email
                    }
                });

                if (!user) {
                    return null;
                }

                if (!user.password) {
                    return null;
                }

                const isPasswordValid = await compare(credentials.password, user.password);

                if (!isPasswordValid) {
                    return null;
                }

                return {
                    id: user.id.toString(),
                    email: user.email,
                    name: user.name
                }
            }
            
        })
    ],
    callbacks: {
        async signIn({ user, profile }) {

            if (profile && profile.email) {
                await prisma.user.upsert({
                    where: {
                        email: profile.email,
                    },
                    create: {
                        email: profile.email,
                        name: profile.name,
                    },
                    update: {
                        name: profile.name,
                    },
                })
                return true;

            } else if (user && user.email) {

                return true;

            } else {
                throw new Error("User does not exist");
            }
        },
        session: ({ session, token }) => {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: Number(token.id)
                }
            }
        },
        jwt: ({ token, user }) => {
            if (user) {
                token.id = Number(user.id)
            }
            return token ;
        }
    }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };