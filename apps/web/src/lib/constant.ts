import { env } from '@/env.mjs';

export const siteConfig = {
  title: 'CartiTracker',
  description:
    'CartiTracker is a web application that allows you to track news, releases, and more from Playboi Carti.',
  keywords: [
    'Playboi Carti',
    'Carti',
    'CartiTracker',
    'Carti Leaks',
    'leaks',
    'news',
    'releases',
    'music',
  ],
  url: env.APP_URL,
  googleSiteVerificationId: env.GOOGLE_SITE_VERIFICATION_ID || '',
};
