import { fetchSpreadsheets } from '@/lib/spreadsheets';

type Track = {
  era: string;
  notice: 'Best Of' | 'Special' | 'Grails' | 'Worst Of' | null;
  name: string;
  notes: string;
  trackLength: string;
  leakDate: Date;
  fileDate: Date | null;
  type: string;
  availability: string;
  quality: string;
  links: string[];
};

function parseDate(dateString: string | null): Date | null {
  if (!dateString) return null;

  const match = dateString.match(/Date\((\d+),(\d+),(\d+)\)/);
  if (!match) return null;

  return new Date(Number(match[1]), Number(match[2]), Number(match[3]));
}

function extractNotice(
  name: string | null
): 'Best Of' | 'Special' | 'Grails' | 'Worst Of' | null {
  if (name?.startsWith('⭐ ')) return 'Best Of';
  if (name?.startsWith('✨ ')) return 'Special';
  if (name?.startsWith('🏆 ')) return 'Grails';
  if (name?.startsWith('🗑️ ')) return 'Worst Of';
  return null;
}

function extractLinks(links: string | null): string[] {
  if (!links || links === 'N/A') return [];
  return links.split('\n').map((link) => link.trim());
}

export async function GET() {
  const spreadsheetData = await fetchSpreadsheets(
    '1rAU0sktd1GKpqo_AAWBtkXy10Px3BB_dnK9yJoN0umw',
    'Recent'
  );

  const tracks: Track[] = spreadsheetData.map((row) => {
    const values = row.c.map((cell) => cell?.v ?? '');
    return {
      era: values[0]!,
      notice: extractNotice(values[1]),
      name: extractNotice(values[1]) ? values[1]!.slice(2) : values[1]!,
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

  return new Response(JSON.stringify(tracks, null, 2), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
