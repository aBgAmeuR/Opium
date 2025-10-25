import { ExploreIcon, HomeIcon } from "@opium/icons";
import { Button } from "@opium/ui/components/button";
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@opium/ui/components/tooltip";
import { cn } from "@opium/ui/lib/utils";
import { Link } from "@tanstack/react-router";

type SidebarNavigationProps = {
  isSidebarOpen: boolean;
};

const NavigationItem = ({
  icon: Icon,
  label,
  isSidebarOpen,
  to,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isSidebarOpen: boolean;
  to: string;
}) => {
  const buttonContent = (
    <Button
      className={cn(
        isSidebarOpen && "relative w-full justify-start",
        "group items-center px-2 text-muted-foreground"
      )}
      render={<Link to={to} />}
      size={isSidebarOpen ? "sm" : "icon-sm"}
      variant="ghost"
    >
      <Icon className={cn(isSidebarOpen, "size-3.5")} />
      {isSidebarOpen && (
        <p className="line-clamp-1 text-xs group-hover:text-foreground">
          {label}
        </p>
      )}
    </Button>
  );

  if (!isSidebarOpen) {
    return (
      <Tooltip delay={10}>
        <TooltipTrigger render={buttonContent} />
        <TooltipPopup side="right" sideOffset={4}>
          {label}
        </TooltipPopup>
      </Tooltip>
    );
  }

  return buttonContent;
};

export function SidebarNavigation({ isSidebarOpen }: SidebarNavigationProps) {
  return (
    <div
      className={cn(
        "mt-2 flex w-full flex-col gap-2 border-hard border-t border-dashed px-3 py-2"
      )}
    >
      <div className="flex w-full flex-col items-start gap-0.5">
        <div className="flex w-full flex-col gap-0.5 border-border/50">
          <NavigationItem
            icon={HomeIcon}
            isSidebarOpen={isSidebarOpen}
            label="Home"
            to="/dashboard"
          />

          <NavigationItem
            icon={ExploreIcon}
            isSidebarOpen={isSidebarOpen}
            label="Explore"
            to="/explore"
          />
        </div>
      </div>
    </div>
  );
}
