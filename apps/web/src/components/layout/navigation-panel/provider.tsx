import {
	createContext,
	type PropsWithChildren,
	useCallback,
	useContext,
	useState,
} from "react";

export const NAVIGATION_PANEL_COOKIE_NAME = "navigation-panel-open";
const NAVIGATION_PANEL_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

type NavigationPanelContextProps = {
	open: boolean;
	setOpen: (value: boolean | ((value: boolean) => boolean)) => void;
	toggleNavigationPanel: () => void;
};

const NavigationPanelContext =
	createContext<NavigationPanelContextProps | null>(null);

export function useNavigationPanel() {
	const context = useContext(NavigationPanelContext);
	if (!context) {
		throw new Error(
			"useNavigationPanel must be used within a NavigationPanelProvider.",
		);
	}

	return context;
}

type NavigationPanelProviderProps = PropsWithChildren<{
	defaultOpen?: boolean;
	open?: boolean;
}>;

export const NavigationPanelProvider = ({
	defaultOpen = true,
	open: openProp,
	children,
}: NavigationPanelProviderProps) => {
	const [_open, _setOpen] = useState(defaultOpen);
	const open = openProp || _open;
	const setOpen = useCallback(
		(value: boolean | ((value: boolean) => boolean)) => {
			const openState = typeof value === "function" ? value(open) : value;
			_setOpen(openState);

			// biome-ignore lint/suspicious/noDocumentCookie: we need to set the cookie for the client
			document.cookie = `${NAVIGATION_PANEL_COOKIE_NAME}=${openState}; path=/; max-age=${NAVIGATION_PANEL_COOKIE_MAX_AGE}`;
		},
		[open],
	);

	const toggleNavigationPanel = useCallback(() => {
		return setOpen((currentOpen) => !currentOpen);
	}, [setOpen]);

	return (
		<NavigationPanelContext.Provider
			value={{ open, setOpen, toggleNavigationPanel }}
		>
			{children}
		</NavigationPanelContext.Provider>
	);
};
