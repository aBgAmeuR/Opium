import { GeistSans } from 'geist/font/sans';
import { JetBrains_Mono } from 'next/font/google';

const fontJetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  fallback: ['system-ui', 'arial'],
});

export const fonts = [GeistSans.variable, fontJetBrainsMono.variable];
