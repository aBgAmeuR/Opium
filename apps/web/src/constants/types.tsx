import { BrainIcon, HandshakeIcon, LockOpenIcon, MicVocalIcon, ScissorsIcon, SparklesIcon } from "lucide-react";

export const types = [
  {
    name: "Leak",
    icon: <LockOpenIcon className="size-6" />,
    color: "bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-500",
  },
  {
    name: "Snippet",
    icon: <ScissorsIcon className="size-6" />,
    color:
      "bg-purple-500 dark:bg-purple-600 hover:bg-purple-600 dark:hover:bg-purple-500",
  },
  {
    name: "Remastered",
    icon: <SparklesIcon className="size-6" />,
    color:
      "bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-500",
  },
  {
    name: "Feature",
    icon: <HandshakeIcon className="size-6" />,
    color:
      "bg-pink-500 dark:bg-pink-600 hover:bg-pink-600 dark:hover:bg-pink-500",
  },
  {
    name: "Performance",
    icon: <MicVocalIcon className="size-6" />,
    color:
      "bg-orange-500 dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-500",
  },
  {
    name: "AI",
    icon: <BrainIcon className="size-6" />,
    color:
      "bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-500",
  },
];
