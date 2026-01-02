import { env } from "@/data/env/server";
import { OAuthClient } from "./base";
import z from "zod";
import { OAuthProviders } from "@/generated/prisma/enums";

export function createGoogleOAuthClient() {
  return new OAuthClient({
    provider: OAuthProviders.GOOGLE,
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    scopes: ["openid", "email", "profile"],
    urls: {
      auth: "https://accounts.google.com/o/oauth2/v2/auth",
      token: "https://oauth2.googleapis.com/token",
      user: "https://openidconnect.googleapis.com/v1/userinfo",
    },
    userInfo: {
      schema: z.object({
        sub: z.string(), // Google user ID
        email: z.email(),
        name: z.string().nullable(),
        picture: z.url(),
      }),

      parser: (user) => ({
        id: user.sub,
        name: user.name ?? "Google User",
        email: user.email,
        image: user.picture,
      }),
    },
  });
}
