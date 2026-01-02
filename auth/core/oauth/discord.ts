import { env } from "@/data/env/server";
import { OAuthClient } from "./base";
import z from "zod";
import { OAuthProviders } from "@/generated/prisma/enums";

export function createDiscordOAuthClient() {
  return new OAuthClient({
    provider: OAuthProviders.DISCORD,
    clientId: env.DISCORD_CLIENT_ID,
    clientSecret: env.DISCORD_CLIENT_SECRET,
    scopes: ["identify", "email"],
    urls: {
      auth: "https://discord.com/oauth2/authorize",
      token: "https://discord.com/api/oauth2/token",
      user: "https://discord.com/api/users/@me",
    },
    userInfo: {
      schema: z.object({
        id: z.string(),
        username: z.string(),
        global_name: z.string().nullable(),
        email: z.email(),
        avatar: z.string().nullable(),
        discriminator: z.string(),
      }),
      parser: (user) => ({
        id: user.id,
        name: user.global_name ?? user.username,
        email: user.email,
        image: user.avatar
          ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
          : `https://cdn.discordapp.com/embed/avatars/${Number(user.discriminator) % 5}.png`,
      }),
    },
  });
}
