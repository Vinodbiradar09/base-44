import {betterAuth , BetterAuthOptions} from "better-auth";
import {MongoClient} from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

export const auth = betterAuth({
    secret : process.env.BETTER_AUTH_SECRET!,
    baseURL : process.env.NEXT_PUBLIC_APP_URL!,
    database : {
        type: "mongodb",
        uri : process.env.MONGODB_URI!,
    },
    socialProviders : {
        google : {
            clientId : process.env.GOOGLE_CLIENT_ID as string,
            clientSecret : process.env.GOOGLE_CLIENT_SECRET as string,
        },
        github : {
            clientId : process.env.GITHUB_CLIENT_ID!,
            clientSecret : process.env.GITHUB_CLIENT_SECRET!,
        }
    }
} satisfies BetterAuthOptions);

export type Session = typeof auth.$Infer.Session;