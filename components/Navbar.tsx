import Link from "next/link";
import { getCurrentUser } from "@/auth/nextjs/currentUser";
import { UserMenu } from "./UserMenu";
import { Button } from "./ui/button";

export async function Navbar() {
  const user = await getCurrentUser({ withFullUser: true });
  console.log(user);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">V</span>
          </div>
          <span className="text-xl font-semibold">Brand</span>
        </Link>

        {user ? (
          <UserMenu email={user.email} avatar={user.image} />
        ) : (
          <Button asChild variant={"outline"}>
            <Link href="/auth/sign-in">Login</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
