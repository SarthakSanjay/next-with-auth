import Link from "next/link";
import { Button } from "./ui/button";
import { getCurrentUser } from "@/auth/nextjs/currentUser";
import Logout from "./Logout";

const Navbar = async () => {
  const user = await getCurrentUser({
    withFullUser: true,
  });
  console.log(user);
  return (
    <div className="h-14 w-full bg-emerald-700 text-white px-10 flex justify-between items-center">
      <div className="font-bold text-lg">LOGO</div>
      <div className="text-black font-bold">{user?.name}</div>
      {user ? (
        <Logout />
      ) : (
        <Button variant={"secondary"} asChild>
          <Link href="/auth/sign-in">Login</Link>
        </Button>
      )}
    </div>
  );
};

export default Navbar;
