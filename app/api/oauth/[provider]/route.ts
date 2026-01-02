import { getOAuthClient } from "@/auth/core/oauth/base";
import { createUserSession } from "@/auth/core/session";
import { OAuthProviders } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import * as z from "zod";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider: rawProvider } = await params;
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  console.log(OAuthProviders);
  const provider = z.enum(OAuthProviders).parse(rawProvider.toUpperCase());

  if (typeof code !== "string" || typeof state !== "string") {
    redirect(
      `/sign-in?oauthError=${encodeURIComponent("Failed to connect. Please try again.")}`,
    );
  }

  try {
    const oAuthCLient = getOAuthClient(provider);
    const oAuthUser = await oAuthCLient.fetchUser(code, state, await cookies());
    const user = await connectUserToAccount(oAuthUser, provider);
    await createUserSession(user, await cookies());
  } catch (error) {
    console.error(error);
    redirect(
      `/sign-in?oauthError=${encodeURIComponent("Failed to connect. Please try again.")}`,
    );
  }
  redirect("/");
}

async function connectUserToAccount(
  {
    id: providerAccountId,
    email,
    name,
    image,
  }: {
    id: string;
    email: string;
    name: string;
    image: string;
  },
  provider: OAuthProviders,
) {
  return prisma.$transaction(async (txn) => {
    let user = await txn.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (!user) {
      user = await txn.user.create({
        data: {
          email: email,
          name: name,
          image: image,
        },
        select: {
          id: true,
          role: true,
        },
      });
    } else {
      user = await txn.user.update({
        where: {
          id: user.id,
        },
        data: {
          name: name,
          image: image,
        },
        select: {
          id: true,
          role: true,
        },
      });
    }

    await txn.userOAuthAccount.upsert({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId,
        },
      },
      update: {
        userId: user?.id,
      },
      create: {
        provider,
        providerAccountId,
        userId: user?.id,
      },
    });

    return user;
  });
}
