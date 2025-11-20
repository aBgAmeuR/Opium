import {
	createContext,
	type PropsWithChildren,
	useCallback,
	useContext,
	useState,
} from "react";

export const SIDEBAR_COOKIE_NAME = "sidebar-open";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

type SidebarContextProps = {
	open: boolean;
	setOpen: (value: boolean | ((value: boolean) => boolean)) => void;
	toggleSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextProps | null>(null);

export function useSidebar() {
	const context = useContext(SidebarContext);
	if (!context) {
		throw new Error("useSidebar must be used within a SidebarProvider.");
	}

	return context;
}

type SidebarProviderProps = PropsWithChildren<{
	defaultOpen?: boolean;
	open?: boolean;
}>;

export const SidebarProvider = ({
	defaultOpen = true,
	open: openProp,
	children,
}: SidebarProviderProps) => {
	const [_open, _setOpen] = useState(defaultOpen);
	const open = openProp || _open;
	const setOpen = useCallback(
		(value: boolean | ((value: boolean) => boolean)) => {
			const openState = typeof value === "function" ? value(open) : value;
			_setOpen(openState);

			// biome-ignore lint/suspicious/noDocumentCookie: we need to set the cookie for the client
			document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
		},
		[open],
	);

	const toggleSidebar = useCallback(() => {
		return setOpen((open) => !open);
	}, [setOpen]);

	return (
		<SidebarContext.Provider value={{ open, setOpen, toggleSidebar }}>
			{children}
		</SidebarContext.Provider>
	);
};
