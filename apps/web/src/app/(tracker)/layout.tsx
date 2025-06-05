import { PropsWithChildren } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { fonts } from '@/lib/fonts';
import { cn } from '@/lib/utils';

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-neutral-50 font-mono antialiased dark:bg-neutral-950',
          fonts
        )}
      >
        <ThemeProvider attribute="class">
          <TooltipProvider delayDuration={10}>
            <main className="flex h-screen min-h-svh flex-col overflow-hidden ">
              {children}
            </main>
            <SpeedInsights />
            <Analytics />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
