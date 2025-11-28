import {
	createContext,
	type PropsWithChildren,
	useContext,
	useState,
} from "react";

type InfoPanelContextProps = {
	type: InfoPanelType;
	setType: (value: InfoPanelType) => void;
};

const InfoPanelContext = createContext<InfoPanelContextProps | null>(null);

export function useInfoPanel() {
	const context = useContext(InfoPanelContext);
	if (!context) {
		throw new Error("useInfoPanel must be used within a InfoPanelProvider.");
	}

	return context;
}

type InfoPanelType = "now-playing" | "queue";

type InfoPanelProviderProps = PropsWithChildren<{
	default?: InfoPanelType;
}>;

export const InfoPanelProvider = ({
	default: defaultType = "now-playing",
	children,
}: InfoPanelProviderProps) => {
	const [type, setType] = useState<InfoPanelType>(defaultType);

	return (
		<InfoPanelContext.Provider value={{ type, setType }}>
			{children}
		</InfoPanelContext.Provider>
	);
};
