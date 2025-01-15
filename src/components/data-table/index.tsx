import { columns } from './columns';
import { Table } from './table';

import { getRecentTracks } from '@/lib/fetch-data';

export async function DataTable() {
  const data = await getRecentTracks();

  const dataTable = data.map((track) => ({
    ...track,
    note: `
      ${track.name.split('\n')[1] || ''}
      ${track.name.split('\n')[2] || ''}
    `,
  }));

  return <Table columns={columns} data={dataTable.slice(0, 100)} />;
}
