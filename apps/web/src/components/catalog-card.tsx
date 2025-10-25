import { Button } from "@opium/ui/components/button";
import {
  Tooltip,
  TooltipPopup,
  TooltipProvider,
  TooltipTrigger,
} from "@opium/ui/components/tooltip";
import { Image } from "@unpic/react";

type CatalogCardProps = {
  name: string;
  imageSrc: string;
  description: string;
  type?: "leak" | "snippet" | "remastered" | "feature" | "performance";
};

export const CatalogCard = ({
  name,
  imageSrc,
  description,
  type,
}: CatalogCardProps) => (
  <Button
    className="relative w-36 flex-col items-start justify-start gap-2.5 p-2 text-muted-foreground"
    variant="ghost"
  >
    <Image
      alt="Album"
      className="size-32 rounded-[4px] object-cover"
      height={128}
      src={imageSrc}
      width={128}
    />
    <div className="flex w-full flex-col">
      <p className="truncate text-left text-foreground text-xs">{name}</p>
      <div className="flex items-center gap-1">
        {/* {type && (
          <p className="flex size-3.5 items-center justify-center rounded-xs bg-foreground/20 object-cover p-0.5 text-[9px]">
            {type.charAt(0).toUpperCase()}
          </p>
        )} */}
        {type && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="w-fit" tabIndex={-1}>
                <p className="flex size-3.5 items-center justify-center rounded-xs bg-foreground/20 object-cover p-0.5 text-[9px]">
                  {type.charAt(0).toUpperCase()}
                </p>
              </TooltipTrigger>
              <TooltipPopup className="py-2">
                <div className="space-y-2">
                  <p className="font-medium text-[13px]">Content Types</p>
                  <div className="space-y-1 text-muted-foreground text-xs">
                    <div className="flex items-center gap-1">
                      <p className="flex size-3.5 items-center justify-center rounded-xs bg-foreground/20 object-cover p-0.5 text-[9px]">
                        L
                      </p>
                      <p>Leak</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <p className="flex size-3.5 items-center justify-center rounded-xs bg-foreground/20 object-cover p-0.5 text-[9px]">
                        S
                      </p>
                      <p>Snippet</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <p className="flex size-3.5 items-center justify-center rounded-xs bg-foreground/20 object-cover p-0.5 text-[9px]">
                        R
                      </p>
                      <p>Remastered</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <p className="flex size-3.5 items-center justify-center rounded-xs bg-foreground/20 object-cover p-0.5 text-[9px]">
                        F
                      </p>
                      <p>Feature</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <p className="flex size-3.5 items-center justify-center rounded-xs bg-foreground/20 object-cover p-0.5 text-[9px]">
                        P
                      </p>
                      <p>Performance</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <p className="flex size-3.5 items-center justify-center rounded-xs bg-foreground/20 object-cover p-0.5 text-[9px]">
                        A
                      </p>
                      <p>AI</p>
                    </div>
                  </div>
                </div>
              </TooltipPopup>
            </Tooltip>
          </TooltipProvider>
        )}
        <p className="truncate text-left text-muted-foreground text-xs">
          {description}
        </p>
      </div>
    </div>
  </Button>
);
