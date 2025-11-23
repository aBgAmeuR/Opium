import type { Icons } from "@opium/icons";
import {
	BrainIcon,
	HandshakeIcon,
	LockOpenIcon,
	MicVocalIcon,
	ScissorsIcon,
	SparklesIcon,
} from "lucide-react";
import type { ReactNode } from "react";

export type MusicType = {
	name: string;
	icon: ReactNode;
};

export const types: MusicType[] = [
	{
		name: "Leak",
		icon: <LockOpenIcon className="size-4" />,
	},
	{
		name: "Snippet",
		icon: <ScissorsIcon className="size-4" />,
	},
	{
		name: "Remastered",
		icon: <SparklesIcon className="size-4" />,
	},
	{
		name: "Feature",
		icon: <HandshakeIcon className="size-4" />,
	},
	{
		name: "Performance",
		icon: <MicVocalIcon className="size-4" />,
	},
	{
		name: "AI",
		icon: <BrainIcon className="size-4" />,
	},
];
