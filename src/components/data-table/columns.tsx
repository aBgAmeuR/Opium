'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ChevronDown, ChevronUp } from 'lucide-react';

import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Item } from './type';

export const columns: ColumnDef<Item>[] = [
  {
    id: 'expander',
    header: () => null,
    cell: ({ row }) => {
      return row.getCanExpand() ? (
        <Button
          {...{
            className: 'size-7 shadow-none text-muted-foreground',
            onClick: row.getToggleExpandedHandler(),
            'aria-expanded': row.getIsExpanded(),
            'aria-label': row.getIsExpanded()
              ? `Collapse details for ${row.original.name}`
              : `Expand details for ${row.original.name}`,
            size: 'icon',
            variant: 'ghost',
          }}
        >
          {row.getIsExpanded() ? (
            <ChevronUp
              className="opacity-60"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
          ) : (
            <ChevronDown
              className="opacity-60"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
          )}
        </Button>
      ) : undefined;
    },
    size: 50,
    maxSize: 50,
    minSize: 50,
  },
  {
    header: 'LeakDate',
    accessorKey: 'leakDate',
    cell: ({ row }) => {
      const date = row.getValue('leakDate') as Date;
      if (!date) return null;
      const formatted = new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
      }).format(date);
      return (
        <div className="text-muted-foreground text-left text-sm">
          {formatted}
        </div>
      );
    },
  },
  {
    header: 'Name',
    accessorKey: 'name',
    cell: ({ row }) => (
      <div className="font-medium">
        {(row.getValue('name') as string).split('\n')[0]}
      </div>
    ),
    size: 400,
  },
  {
    header: 'Era',
    accessorKey: 'era',
    cell: ({ row }) => <div>{row.getValue('era')}</div>,
  },
  {
    header: 'Notice',
    accessorKey: 'notice',
    cell: ({ row }) =>
      row.getValue('notice') ? (
        <Badge>{row.getValue('notice')}</Badge>
      ) : (
        <div className="text-muted-foreground">-</div>
      ),
  },
  {
    header: 'Availability',
    accessorKey: 'availability',
    cell: ({ row }) =>
      row.getValue('availability') ? (
        <div>{row.getValue('availability')}</div>
      ) : (
        <div className="text-muted-foreground">-</div>
      ),
  },
  {
    header: 'Quality',
    accessorKey: 'quality',
    cell: ({ row }) => <div>{row.getValue('quality')}</div>,
  },
  {
    header: 'Type',
    accessorKey: 'type',
    cell: ({ row }) => <div>{row.getValue('type')}</div>,
  },
  // {
  //   header: 'Links',
  //   accessorKey: 'links',
  //   cell: ({ row }) => {
  //     const links = getLinks(row.getValue('links') as string[]);
  //     return (
  //       <div className="flex gap-2">
  //         {links
  //           .filter((link) => link.isPillowcase)
  //           .map((link, index) => (
  //             <audio
  //               key={index}
  //               controls
  //               src={link.link}
  //               className="w-full"
  //             ></audio>
  //           ))}
  //       </div>
  //     );
  //   },
  // },
];
