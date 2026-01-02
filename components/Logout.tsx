"use client";
import { logout } from "@/auth/nextjs/action";
import { Button } from "./ui/button";

const Logout = () => {
  return (
    <Button variant={"destructive"} onClick={() => logout()}>
      Logout
    </Button>
  );
};

export default Logout;
