"use client";

import { AnimatePresence } from "framer-motion";
import { AngryIcon } from "lucide-react";
import type { PropsWithChildren } from "react";
import { Sidebar } from "./sidebar/sidebar";

type RootLayoutProps = PropsWithChildren<{
	isAdmin?: boolean;
}>;

export const RootLayout = ({ children, isAdmin = false }: RootLayoutProps) => {
	//   const { isSidebarOpen, isMobileSidebarOpen, setIsMobileSidebarOpen } =
	//     useRootContext();
	const isSidebarOpen = true;

	return (
		<div className="flex h-dvh w-full flex-row overflow-hidden bg-sidebar">
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
			<div className="hidden md:flex">
				{isSidebarOpen && <Sidebar isAdmin={isAdmin} />}
			</div>

			{/* <Drawer.Root
        direction="left"
        onOpenChange={setIsMobileSidebarOpen}
        open={isMobileSidebarOpen}
        shouldScaleBackground
      >
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-30 backdrop-blur-sm" />
          <Drawer.Content className="fixed top-0 bottom-0 left-0 z-[50]">
            <Flex className="pr-2">
              <Sidebar />
            </Flex>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root> */}

			{/* Main Content */}
			<div className="flex flex-1 overflow-hidden">
				<div className="flex w-full py-1 pr-1">
					<div className="relative flex h-[calc(99dvh)] w-full flex-1 flex-row overflow-hidden rounded-sm border border-border bg-background shadow-sm">
						<div className="relative flex h-full w-0 flex-1 flex-row">
							<div className="flex w-full flex-col gap-2 overflow-y-auto">
								{/* Auth Button Header */}

								{children}
							</div>
						</div>
						{/* <SideDrawer />
            <FeedbackWidget />
            <IntroDialog /> */}
					</div>
				</div>
				{/* <SettingsModal />
        <CommandSearch /> */}
			</div>

			{/* <Toaster /> */}
		</div>
	);
};
