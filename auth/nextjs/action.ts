"use server";

import z from "zod";
import { signInSchema, signUpSchema } from "./schema";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  generateSalt,
  hashPassword,
  comparePasswords,
} from "../core/passwordHasher";
import { createUserSession, removeUserFromSession } from "../core/session";
import { cookies } from "next/headers";
import { getOAuthClient, OAuthClient } from "../core/oauth/base";
import { OAuthProviders } from "@/generated/prisma/enums";

export async function signIn(unsafeData: z.infer<typeof signInSchema>) {
  const { success, data } = signInSchema.safeParse(unsafeData);
  console.log(data);

  if (!success) return "unable to login";

  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (user == null || user.password == null || user.salt == null) {
    return "Unable to login";
  }

  const isPasswordCorrect = await comparePasswords({
    hashedPassword: user.password,
    password: data.password,
    salt: user.salt,
  });

  if (!isPasswordCorrect) return "Unable to login";

  await createUserSession(user, await cookies());
  redirect("/");
}

export async function signUp(unsafeData: z.infer<typeof signUpSchema>) {
  const { success, data } = signUpSchema.safeParse(unsafeData);
  console.log(data);

  if (!data) return "Invalid credentials";

  if (!success) return "Unable to create account";

  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingUser) return "Account already exists for this email.";

  try {
    const salt = generateSalt();
    const hashedPassword = await hashPassword(data.password, salt);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        salt: salt,
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (user === null) return "Unable to create account";
    await createUserSession(user, await cookies());
  } catch (error) {
    return "Unable to create Account";
  }

  redirect("/");
}

export async function logout() {
  await removeUserFromSession(await cookies());
  redirect("/");
}

export async function oAuthSignIn(provider: OAuthProviders) {
  const oAuthClient = getOAuthClient(provider);
  redirect(oAuthClient.createAuthUrl(await cookies()));
}
