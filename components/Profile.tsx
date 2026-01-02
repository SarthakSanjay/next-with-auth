import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

export function Profile({ imgUrl }: { imgUrl: string }) {
  return (
    <Avatar>
      <AvatarImage src={imgUrl} alt="" className="" />
      <AvatarFallback>
        <User className="h-5 w-5" />
      </AvatarFallback>
    </Avatar>
  );
}
