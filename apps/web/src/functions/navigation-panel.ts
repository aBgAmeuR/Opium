import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";

const NAVIGATION_PANEL_COOKIE_NAME = "navigation-panel-open";

export const getNavigationPanelStateFn = createServerFn({
	method: "GET",
}).handler(() => getCookie(NAVIGATION_PANEL_COOKIE_NAME) !== "false");


