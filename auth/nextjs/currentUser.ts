import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "../core/session";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { cache } from "react";

type Fulluser = Exclude<
  Awaited<ReturnType<typeof getUserFromDB>>,
  undefined | null
>;

type User = Exclude<
  Awaited<ReturnType<typeof getUserFromSession>>,
  undefined | null
>;

function _getCurrentUser(options: {
  withFullUser: true;
  redirectIfNotFound: true;
}): Promise<Fulluser>;
function _getCurrentUser(options: {
  withFullUser: true;
  redirectIfNotFound?: false;
}): Promise<Fulluser | null>;
function _getCurrentUser(options: {
  withFullUser?: false;
  redirectIfNotFound: true;
}): Promise<User>;
function _getCurrentUser(options: {
  withFullUser?: false;
  redirectIfNotFound?: false;
}): Promise<User | null>;
async function _getCurrentUser({
  withFullUser = false,
  redirectIfNotFound = false,
} = {}) {
  const user = await getUserFromSession(await cookies());

  if (user == null) {
    if (redirectIfNotFound) return redirect("/sign-in");
    return null;
  }

  if (withFullUser) {
    const fulluser = await getUserFromDB(user.id);
    if (fulluser == null) throw new Error("user not found in the database");
    return fulluser;
  }

  return user;
}
function getUserFromDB(id: string) {
  return prisma.user.findUnique({
    where: { id: id },
    select: {
      id: true,
      email: true,
      role: true,
      name: true,
      image: true,
    },
  });
}

export const getCurrentUser = cache(_getCurrentUser);
