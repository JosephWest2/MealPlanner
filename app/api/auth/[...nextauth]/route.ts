import { AuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prismaSingleton";
import { compare } from "bcrypt";
import type { KrogerProfile } from "@/types";
import { AdapterUser } from "next-auth/adapters";

export const authOptions : AuthOptions = {
    pages: {
      signIn: "/login",
      newUser: "/register",
      signOut: "/signout"
    },
    session: { strategy: "jwt"},
    providers: [
        {
            id: "kroger",
            name: "Kroger",
            type: "oauth",
            clientId: process.env.KROGER_CLIENT_ID,
            clientSecret: process.env.KROGER_CLIENT_SECRET,
            authorization: { url: "https://api.kroger.com/v1/connect/oauth2/authorize", params: { scope: "profile.compact product.compact cart.basic:write"}},
            token: "https://api.kroger.com/v1/connect/oauth2/token",
            userinfo: "https://api.kroger.com/v1/identity/profile",
            profile(profile : KrogerProfile) {
              return {
                id: profile.data.id,
                testvar: "JSHDFAKJHSDFKDASHKLJDFAHJKLDFHK"
              }
            },
        },
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
            if (profile) {
                const _profile = profile as KrogerProfile;
                if (_profile.data && _profile.data.id) {
                    return true;
                }
                return false;
            } else if (user && user.email) {
                return true;
            } else {
                return true;
            }
        },
        session: ({ session, token }) => {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: Number(token.id),
                    
                },
                accessToken: token.accessToken
            }
        },
        jwt: ({ token, user, account }) => {
            if (user) {
                token.id = Number(user.id)
            }
            if (account) {
                token.accessToken = account.access_token
            }
            return token ;
        }
    }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };