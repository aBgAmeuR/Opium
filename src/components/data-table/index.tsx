import Link from 'next/link';

import { AudioPlayer } from '../audio-player';
import { buttonVariants } from '../ui/button';
import { columns } from './columns';
import { Table } from './table';

import { getRecentTracks } from '@/lib/fetch-data';
import { cn, getLinks } from '@/lib/utils';

export async function DataTable() {
  const data = await getRecentTracks();

  const dataTable = data.map((track) => ({
    ...track,
    note: (
      <div>
        {track.name.split('\n')[1] && (
          <div className="text-muted-foreground">
            {track.name.split('\n')[1]}
          </div>
        )}
        {track.name.split('\n')[2] && (
          <div className="text-muted-foreground">
            {track.name.split('\n')[2]}
          </div>
        )}
        {track.notes && (
          <div className="text-muted-foreground">{track.notes}</div>
        )}
        <div className="mt-2 flex gap-2">
          {getLinks(track.links).map((link, index) =>
            link.isPillowcase ? (
              <AudioPlayer key={index} src={link.link} />
            ) : (
              <Link
                key={index}
                href={link.link}
                target="_blank"
                className={cn(buttonVariants({ size: 'sm' }))}
              >
                View
              </Link>
            )
          )}
        </div>
      </div>
    ),
  }));

  return <Table columns={columns} data={dataTable.slice(0, 1000)} />;
}
