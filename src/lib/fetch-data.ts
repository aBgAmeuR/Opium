import 'server-only';
import { fetchSpreadsheets, parseDate } from '@/lib/spreadsheets';
import { extractLinks, extractNoticeAndName } from '@/lib/utils';
import { RecentTrack } from '@/types/recent-tracks';

export const getRecentTracks = async () => {
  const spreadsheetData = await fetchSpreadsheets(
    '1rAU0sktd1GKpqo_AAWBtkXy10Px3BB_dnK9yJoN0umw',
    'Recent'
  );

  const tracks: RecentTrack[] = spreadsheetData.map((row) => {
    const values = row.c.map((cell) => cell?.v ?? '');
    const { notice, name } = extractNoticeAndName(values[1]);
    return {
      era: values[0]!,
      notice,
      name,
      notes: values[2]!,
      trackLength: values[3]!,
      leakDate: parseDate(values[4])!,
      fileDate: parseDate(values[5]),
      type: values[6]!,
      availability: values[7]!,
      quality: values[8]!,
      links: extractLinks(values[9]),
    };
  });

  return tracks;
};
