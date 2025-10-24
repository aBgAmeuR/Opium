import { Button } from "@opium/ui/components/button";
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@opium/ui/components/tooltip";
import { cn } from "@opium/ui/lib/utils";
import { Image } from "@unpic/react";
import { ChevronRightIcon } from "lucide-react";

const IMAGE_SIZE_OPEN = 32;
const IMAGE_SIZE_CLOSED = 24;

type SidebarLibraryProps = {
  isSidebarOpen: boolean;
};

const LibraryItem = ({
  title,
  imageSrc,
  isSidebarOpen,
}: {
  title: string;
  imageSrc: string;
  isSidebarOpen: boolean;
}) => {
  const buttonContent = (
    <Button
      className={cn(
        isSidebarOpen && "relative w-full justify-start gap-2.5 p-2",
        !isSidebarOpen && "w-full justify-center px-0 py-4.5",
        "items-center text-muted-foreground"
      )}
      size={isSidebarOpen ? "sm" : "icon-sm"}
      variant="ghost"
    >
      <div className={cn(!isSidebarOpen && "flex justify-center")}>
        <Image
          alt={title}
          className={cn(
            "rounded-[4px] object-cover",
            isSidebarOpen ? "size-8" : "size-6"
          )}
          height={isSidebarOpen ? IMAGE_SIZE_OPEN : IMAGE_SIZE_CLOSED}
          src={imageSrc}
          width={isSidebarOpen ? IMAGE_SIZE_OPEN : IMAGE_SIZE_CLOSED}
        />
      </div>
      {isSidebarOpen && (
        <p className="line-clamp-1 text-xs hover:text-foreground">{title}</p>
      )}
    </Button>
  );

  if (!isSidebarOpen) {
    return (
      <Tooltip delay={10}>
        <TooltipTrigger render={buttonContent} />
        <TooltipPopup side="right" sideOffset={4}>
          {title}
        </TooltipPopup>
      </Tooltip>
    );
  }

  return buttonContent;
};

export const SidebarLibrary = ({ isSidebarOpen }: SidebarLibraryProps) => {
  const libraryItems = [
    {
      title: "Whole Lotta Red",
      imageSrc:
        "https://cdn-images.dzcdn.net/images/cover/3c5f5f3f5f41ff96f961afd7df7eb4d9/0x1900-000000-80-0-0.jpg",
    },
    {
      title: "Die Lit",
      imageSrc:
        "https://cdn-images.dzcdn.net/images/cover/f2d66b587ca8d3f0fa222c3501d23564/1900x1900-000000-81-0-0.jpg",
    },
    {
      title: "Playboi Carti",
      imageSrc:
        "https://cdn-images.dzcdn.net/images/cover/0ae8e05f734268cbe5aae06f96f2b1f2/0x1900-000000-80-0-0.jpg",
    },
  ];

  return (
    <div
      className={cn(
        "flex w-full flex-col justify-center gap-0.5 border-hard border-t border-dashed py-2",
        isSidebarOpen ? "px-3" : "px-1"
      )}
    >
      {isSidebarOpen && (
        <Button
          className={cn(
            "w-full justify-start text-muted-foreground",
            !isSidebarOpen && "w-auto justify-center"
          )}
          size={isSidebarOpen ? "xs" : "icon-sm"}
          variant="ghost"
        >
          {isSidebarOpen && "Your library"}
          {isSidebarOpen && <span className="inline-flex flex-1" />}
          {isSidebarOpen && <ChevronRightIcon size={14} strokeWidth={2} />}
        </Button>
      )}

      <div
        className={cn(
          "no-scrollbar flex w-full flex-col gap-0 overflow-y-auto",
          !isSidebarOpen && "py-1"
        )}
      >
        {libraryItems.map((item) => (
          <LibraryItem
            imageSrc={item.imageSrc}
            isSidebarOpen={isSidebarOpen}
            key={item.title}
            title={item.title}
          />
        ))}
      </div>
    </div>
  );
};
