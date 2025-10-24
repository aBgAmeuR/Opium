import { SidebarLeftIcon } from "@opium/icons";
import { Button } from "@opium/ui/components/button";
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@opium/ui/components/tooltip";
import { cn } from "@opium/ui/lib/utils";
import { Link } from "@tanstack/react-router";
import { Icon } from "../../icons";

type SidebarHeaderProps = {
  isSidebarOpen: boolean;
  onToggle: () => void;
};

export function SidebarHeader({ isSidebarOpen, onToggle }: SidebarHeaderProps) {
  return (
    <div className="mb-3 flex w-full flex-row items-center justify-between">
      <Link className="w-full" to="/">
        <div
          className={cn(
            "flex h-8 w-full cursor-pointer items-center justify-start gap-1.5 px-4",
            !isSidebarOpen && "justify-center px-0"
          )}
        >
          {isSidebarOpen ? (
            <Icon.Wordmark className="h-5" />
          ) : (
            <Icon.Logo className="size-5" />
          )}
        </div>
      </Link>
      {isSidebarOpen && (
        <Tooltip delay={10}>
          <TooltipTrigger
            render={
              <Button
                className={cn(!isSidebarOpen && "mx-auto", "mr-2")}
                onClick={onToggle}
                size="icon-sm"
                variant="ghost"
              />
            }
          >
            <SidebarLeftIcon className="size-4" />
          </TooltipTrigger>
          <TooltipPopup side="right" sideOffset={4}>
            Close sidebar
          </TooltipPopup>
        </Tooltip>
      )}
    </div>
  );
}
