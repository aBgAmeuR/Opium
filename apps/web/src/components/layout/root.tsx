import { AngryIcon } from "lucide-react";
import { type PropsWithChildren, useState } from "react";
import { AudioPlayer } from "@/components/audio/audio-player";
import { RightSidebar } from "./right-sidebar";
import { Sidebar } from "./sidebar/sidebar";

type RootLayoutProps = PropsWithChildren<{
	isAdmin?: boolean;
}>;

export const RootLayout = ({ children, isAdmin = false }: RootLayoutProps) => {
	const [isQueueOpen, setIsQueueOpen] = useState(false);

	return (
		<div className="flex h-dvh w-full flex-col overflow-hidden bg-sidebar">
			<div className="item-center fixed inset-0 z-99999 flex justify-center bg-background md:hidden">
				<div className="flex flex-col items-center justify-center gap-2">
					<AngryIcon
						className="text-muted-foreground"
						size={24}
						strokeWidth={2}
					/>
					<span className="text-center text-muted-foreground text-sm">
						Mobile version is coming soon.
						<br /> Please use a desktop browser.
					</span>
				</div>
			</div>
			<div className="flex flex-1 overflow-hidden">
				<div className="hidden md:flex">
					<Sidebar isAdmin={isAdmin} />
				</div>

				<div className="flex flex-1 overflow-hidden">
					<div className="flex w-full pt-1">
						<div className="relative flex w-full flex-1 flex-row overflow-hidden rounded-t-sm border-t border-x border-border bg-background">
							<div className="relative flex h-full w-0 flex-1 flex-row">
								<div className="flex w-full flex-col gap-2 overflow-y-auto">
									{children}
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="hidden md:flex">
					<RightSidebar
						isQueueOpen={isQueueOpen}
						setIsQueueOpen={setIsQueueOpen}
					/>
				</div>
			</div>

			<div className="hidden md:flex relative bottom-0 left-0 right-0">
				<div className="z-50 bg-sidebar w-full">
					<AudioPlayer onToggleQueue={() => setIsQueueOpen(!isQueueOpen)} />
				</div>
			</div>
		</div>
	);
};
