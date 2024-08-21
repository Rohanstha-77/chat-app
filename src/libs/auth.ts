import { db } from "./db";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";

function getGoogleCredentials() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || clientId.length === 0) {
        throw new Error("Missing GOOGLE_CLIENT_ID");
    }
    if (!clientSecret || clientSecret.length === 0) {
        throw new Error("Missing GOOGLE_CLIENT_SECRET");
    }
    return { clientId, clientSecret };
}

export const authOptions: NextAuthOptions = {
    adapter: UpstashRedisAdapter(db),
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/login',
    },
    providers: [
        GoogleProvider({
            clientId: getGoogleCredentials().clientId,
            clientSecret: getGoogleCredentials().clientSecret,
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            // console.log("JWT Callback:", { token, user });

            if (user) {
                // First-time sign-in, store user information in the token
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                token.picture = user.image;
            } else {
                // Subsequent calls to JWT callback
                const dbUser = (await db.get(`user ${token.id}`)) as User | null;

                if (dbUser) {
                    // Update token with user information from the database
                    token.id = dbUser.id;
                    token.name = dbUser.name;
                    token.email = dbUser.email;
                    token.picture = dbUser.image;
                } else {
                    console.log("No user found in database");
                }
            }

            return token;
        },
        async session({ session, token }) {
            // console.log("Session Callback:", { session, token });

            if (token) {
                // Attach token data to session
                session.user = {
                    id: token.id as string,
                    name: token.name as string | undefined,
                    email: token.email as string | undefined,
                    image: token.picture as string | undefined,
                };
            }

            return session;
        },
        async redirect() {
            // Redirect after sign-in
            return '/dashboard';
        },
    },
};
