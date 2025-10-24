import { MoonIcon, SidebarRightIcon, SunIcon, UserIcon } from "@opium/icons";
import { Button } from "@opium/ui/components/button";
import {
  Menu,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuPopup,
  MenuTrigger,
} from "@opium/ui/components/menu";
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@opium/ui/components/tooltip";
import { useTheme } from "@opium/ui/hooks/use-theme";
import { cn } from "@opium/ui/lib/utils";
import { Link, useNavigate } from "@tanstack/react-router";
import { LogOutIcon, Settings2Icon } from "lucide-react";
import { authClient } from "@/lib/auth-client";

type SidebarUserMenuProps = {
  isSidebarOpen: boolean;
  onToggle: () => void;
};

export const SidebarUserMenu = ({
  isSidebarOpen,
  onToggle,
}: SidebarUserMenuProps) => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { data: session } = authClient.useSession();

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
    <div
      className={cn(
        "absolute bottom-0 mt-auto flex w-full flex-col items-center gap-2 to-transparent p-2 pt-12",
        isSidebarOpen && "items-start justify-between"
      )}
    >
      {!isSidebarOpen && (
        <Tooltip delay={10}>
          <TooltipTrigger
            render={
              <Button
                className={cn(!isSidebarOpen && "mx-auto")}
                onClick={onToggle}
                size="icon"
                variant="ghost"
              />
            }
          >
            <SidebarRightIcon className="size-4" />
          </TooltipTrigger>
          <TooltipPopup side="right" sideOffset={4}>
            Open sidebar
          </TooltipPopup>
        </Tooltip>
      )}

      {session && (
        <Menu>
          <MenuTrigger
            render={
              <Button
                className={cn(
                  isSidebarOpen && "relative w-full",
                  "justify-center px-2 text-muted-foreground"
                )}
                size={isSidebarOpen ? "sm" : "icon-sm"}
                variant="outline"
              />
            }
          >
            <UserIcon className="size-4" />
            {isSidebarOpen && "Profile"}
          </MenuTrigger>
          <MenuPopup align="end" side="right" sideOffset={4}>
            <MenuGroup>
              <MenuGroupLabel>Preferences</MenuGroupLabel>
              <MenuItem
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              >
                <SunIcon className="block size-4 dark:hidden" />
                <MoonIcon className="hidden size-4 dark:block" />
                Theme
              </MenuItem>
            </MenuGroup>
            <MenuGroup>
              <MenuGroupLabel>Account</MenuGroupLabel>
              <MenuItem>
                <Settings2Icon className="size-4" />
                Settings
              </MenuItem>
              <MenuItem onClick={signOut} variant="destructive">
                <LogOutIcon className="size-4" />
                Logout
              </MenuItem>
            </MenuGroup>
          </MenuPopup>
        </Menu>
      )}

      {isSidebarOpen && !session && (
        <div className="flex w-full flex-col gap-1.5 p-1">
          <Button size="sm" variant="outline">
            <Settings2Icon size={14} strokeWidth={2} />
            Settings
          </Button>
          <Button render={<Link to="/login" />} size="sm">
            Log in
          </Button>
        </div>
      )}
    </div>
  );
};
