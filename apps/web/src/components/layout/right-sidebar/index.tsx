import { cn } from "@opium/ui/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { NowPlayingView } from "./now-playing";
import { QueueView } from "./queue";

type RightSidebarProps = {
	isQueueOpen: boolean;
	setIsQueueOpen: (open: boolean) => void;
};

export const RightSidebar = ({
	isQueueOpen,
	setIsQueueOpen,
}: RightSidebarProps) => {
	return (
		<div
			className={cn(
				"relative top-0 bottom-0 left-0 z-50 flex h-dvh shrink-0 flex-col py-2 transition-all duration-200",
				"top-0 h-full w-[200px]",
			)}
		>
			<AnimatePresence>
				{!isQueueOpen ? (
					<NowPlayingView openQueue={() => setIsQueueOpen(true)} />
				) : (
					<motion.div
						initial={{ opacity: 0.8, y: 32 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0.8, y: -32 }}
						transition={{ duration: 0.2, ease: "easeInOut" }}
					>
						<QueueView onClose={() => setIsQueueOpen(false)} />
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};
