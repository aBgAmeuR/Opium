import { MoonIcon, SunIcon } from "@opium/icons";
import { Button } from "@opium/ui/components/button";
import { useTheme } from "next-themes";
import type * as React from "react";

function ThemeToggle(props: React.ComponentProps<typeof Button>) {
	const { setTheme, theme } = useTheme();

	return (
		<Button
			aria-label="Toggle theme"
			onClick={() => setTheme(theme === "light" ? "dark" : "light")}
			size="icon"
			variant="ghost"
			{...props}
		>
			<SunIcon className="dark:-rotate-90 rotate-0 scale-100 transition-all dark:scale-0 size-4.5" />
			<MoonIcon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 size-4.5" />
		</Button>
	);
}

export { ThemeToggle };
