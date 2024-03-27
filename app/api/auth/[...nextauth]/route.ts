import { AuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import type { KrogerProfile } from "@/types";

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
                id: profile.data.id
              }
            },
        }
    ],
    callbacks: {
        async signIn({ profile }) {
            if (profile) {
                const _profile = profile as KrogerProfile;
                if (_profile.data && _profile.data.id) {
                    return true;
                }
            }
            return false;
        },
        session: ({ session, token }) => {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: Number(token.id),
                    
                },
                accessToken: token.accessToken,
                refreshToken: token.refreshToken,
                expiresAt: token.expiresAt
            }
        },
        jwt: ({ token, account }) => {
            if (account) {
                token.accessToken = account.access_token,
                token.refreshToken = account.refresh_token,
                token.expiresAt = Date.now() + 1800 * 1000
            }
            return token;
        }
    }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };