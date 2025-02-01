import '@/styles/globals.css';

import { PropsWithChildren } from 'react';
import type { Metadata } from 'next';

import { siteConfig } from '@/lib/constant';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  robots: { index: true, follow: true },
  icons: {
    icon: '/favicon/favicon.ico',
    // shortcut: '/favicon/favicon-16x16.png',
    // apple: '/favicon/apple-touch-icon.png',
  },
  // openGraph: {
  //   url: siteConfig.url,
  //   title: siteConfig.title,
  //   description: siteConfig.description,
  //   siteName: siteConfig.title,
  //   images: '/opengraph-image.png',
  //   type: 'website',
  //   locale: 'en_US',
  // },
  // twitter: {
  //   card: 'summary_large_image',
  //   title: siteConfig.title,
  //   description: siteConfig.description,
  //   images: '/opengraph-image.png',
  // },
  // verification: {
  //   google: siteConfig.googleSiteVerificationId,
  // },
};

const RootLayout = ({ children }: PropsWithChildren) => {
  return children;
};

export default RootLayout;
