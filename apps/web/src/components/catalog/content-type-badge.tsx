import {
	Tooltip,
	TooltipPopup,
	TooltipProvider,
	TooltipTrigger,
} from "@opium/ui/components/tooltip";

export type ContentType =
	| "leak"
	| "remastered"
	| "feature"
	| "performance"
	| "official"
	| "remix"
	| "AI"
	| "fan made";

type ContentTypeBadgeProps = {
	type: ContentType;
};

export const ContentTypeBadge = ({ type }: ContentTypeBadgeProps) => (
	<TooltipProvider>
		<Tooltip>
			<TooltipTrigger
				className="w-fit"
				tabIndex={-1}
				render={
					<p className="flex size-3.5! items-center justify-center rounded-xs bg-foreground/20 object-cover text-[9px]" />
				}
			>
				{type.charAt(0).toUpperCase()}
			</TooltipTrigger>
			<TooltipPopup className="py-2">
				<div className="space-y-1">
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
);
