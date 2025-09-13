import { createAuthClient } from "better-auth/react";
import {Session} from "@/lib/auth";

const baseURL = process.env.NEXT_PUBLIC_APP_URL;
if (!baseURL) {
  throw new Error('NEXT_PUBLIC_APP_URL is required for authClient');
}

export const authClient = createAuthClient({
    baseURL,
});

export type ClientSession = Session | null;