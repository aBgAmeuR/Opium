import { Button } from "@opium/ui/components/button";
import {
  Menu,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuPopup,
  MenuTrigger,
} from "@opium/ui/components/menu";
import { Skeleton } from "@opium/ui/components/skeleton";
import { ThemeToggle } from "@opium/ui/components/theme";
import { Navigate, useNavigate } from "@tanstack/react-router";
import { LogOutIcon, UserIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Icon } from "../icons";

export function Header() {
  const navigate = useNavigate();
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <Skeleton className="h-9 w-24" />;
  }
  if (!session) return <Navigate replace to="/login" />;

  const signOut = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          navigate({
            to: "/",
          });
        },
      },
    });
  };

  return (
    <div>
      <div className="flex flex-row items-center justify-between px-2 py-1">
        <Icon.Wordmark className="mt-1 h-4" />
        <nav className="flex gap-4 text-lg" />
        <div className="flex items-center gap-1">
          <ThemeToggle variant="ghost" />
          <Menu openOnHover>
            <MenuTrigger render={<Button size="icon" variant="outline" />}>
              <UserIcon className="size-4" />
            </MenuTrigger>
            <MenuPopup>
              <MenuGroup>
                <MenuGroupLabel>My Account</MenuGroupLabel>
                <MenuItem onClick={signOut} variant="destructive">
                  <LogOutIcon />
                  Sign Out
                </MenuItem>
              </MenuGroup>
            </MenuPopup>
          </Menu>
        </div>
      </div>
      <hr />
    </div>
  );
}
