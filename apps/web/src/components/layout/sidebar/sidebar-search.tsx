import { SearchIcon } from "@opium/icons";
import { Button } from "@opium/ui/components/button";
import { cn } from "@opium/ui/lib/utils";

type SidebarSearchProps = {
  isSidebarOpen: boolean;
};

const CommandMenuKbd = ({
  className,
  ...props
}: React.ComponentProps<"kbd">) => (
  <kbd
    className={cn(
      "pointer-events-none flex h-5 select-none items-center justify-center gap-1 rounded border bg-background px-1 font-medium font-sans text-[0.7rem] text-muted-foreground [&_svg:not([class*='size-'])]:size-3",
      className
    )}
    {...props}
  />
);

export const SidebarSearch = ({ isSidebarOpen }: SidebarSearchProps) => {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-end gap-2 px-3",
        !isSidebarOpen && "items-center justify-center px-0"
      )}
    >
      <Button
        className={cn(
          isSidebarOpen && "relative w-full",
          "items-center justify-center px-2 text-muted-foreground"
        )}
        // onClick={() => setIsCommandSearchOpen(true)}
        size={isSidebarOpen ? "sm" : "icon-sm"}
        variant="outline"
      >
        <SearchIcon className={cn(isSidebarOpen, "size-3.5")} />
        {isSidebarOpen && <p className="line-clamp-1 text-xs">Search</p>}
        {isSidebarOpen && <div className="flex-1" />}
        {isSidebarOpen && (
          <div className="flex flex-row items-center gap-0.5">
            <CommandMenuKbd>Ctrl</CommandMenuKbd>
            <CommandMenuKbd className="aspect-square">K</CommandMenuKbd>
          </div>
        )}
      </Button>
    </div>
  );
};
