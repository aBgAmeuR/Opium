import { AnimatePresence, motion } from "framer-motion";
import { useInfoPanel } from "./provider";
import { SectionNowPlaying } from "./section-now-playing";
import { SectionQueue } from "./section-queue";

export { InfoPanelProvider, useInfoPanel } from "./provider";
export { SectionNowPlaying } from "./section-now-playing";
export { SectionQueue } from "./section-queue";

export const InfoPanel = () => {
	const { type } = useInfoPanel();

	return (
		<div className="top-0 h-full w-[200px] relative bottom-0 left-0 z-50 flex shrink-0 flex-col py-2 transition-all duration-200">
			<AnimatePresence>
				{type === "now-playing" && <SectionNowPlaying />}
				{type === "queue" && (
					<motion.div
						initial={{ opacity: 0.8, y: 32 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0.8, y: -32 }}
						transition={{ duration: 0.2, ease: "easeInOut" }}
					>
						<SectionQueue />
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};
