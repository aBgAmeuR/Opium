import { ToastProvider } from "@opium/ui/components/toast";
import { ThemeProvider } from "next-themes";
import type { PropsWithChildren } from "react";

export const Providers = ({ children }: PropsWithChildren) => (
  <ToastProvider>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  </ToastProvider>
);
