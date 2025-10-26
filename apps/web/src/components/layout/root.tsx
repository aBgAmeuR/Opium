"use client";

import { AnimatePresence } from "framer-motion";
import { AngryIcon } from "lucide-react";
import type { PropsWithChildren } from "react";
import { Sidebar } from "./sidebar";

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
        <AnimatePresence>{isSidebarOpen && <Sidebar isAdmin={isAdmin} />}</AnimatePresence>
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

// export const SideDrawer = () => {
//   const pathname = usePathname();
//   const sideDrawer = useAppStore((state) => state.sideDrawer);
//   const dismissSideDrawer = useAppStore((state) => state.dismissSideDrawer);
//   const { scrollRef, contentRef } = useStickToBottom({
//     stiffness: 1,
//     damping: 0,
//   });
//   const isThreadPage = pathname.startsWith("/chat/");

//   return (
//     <AnimatePresence>
//       {sideDrawer.open && isThreadPage && (
//         <motion.div
//           animate={{ opacity: 1, x: 0 }}
//           className="flex min-h-[99dvh] w-[500px] shrink-0 flex-col overflow-hidden py-1.5 pr-1.5 pl-0.5"
//           exit={{ opacity: 0, x: 40 }}
//           initial={{ opacity: 0, x: 40 }}
//           transition={{
//             type: "spring",
//             stiffness: 300,
//             damping: 30,
//             exit: { duration: 0.2 },
//           }}
//         >
//           <div className="flex h-full w-full flex-col overflow-hidden rounded-lg border-border bg-background shadow-subtle-xs">
//             <div className="flex flex-row items-center justify-between gap-2 border-border border-b py-1.5 pr-2 pl-4">
//               <div className="font-medium text-sm">
//                 {typeof sideDrawer.title === "function"
//                   ? sideDrawer.title()
//                   : sideDrawer.title}
//               </div>
//               {sideDrawer.badge && (
//                 <Badge variant="default">{sideDrawer.badge}</Badge>
//               )}
//               <div className="flex-1" />
//               <Button
//                 onClick={() => dismissSideDrawer()}
//                 size="icon-xs"
//                 tooltip="Close"
//                 variant="secondary"
//               >
//                 <IconX size={14} strokeWidth={2} />
//               </Button>
//             </div>
//             <div
//               className="no-scrollbar flex flex-1 flex-col gap-2 overflow-y-auto p-2"
//               ref={scrollRef}
//             >
//               <div className="w-full" ref={contentRef}>
//                 {sideDrawer.renderContent()}
//               </div>
//             </div>
//           </div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };
