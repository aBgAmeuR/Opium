'use client';

import React from 'react';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MultiSelect } from '@/components/ui/multi-select';
import { useRecentSongsFiltersStore } from '@/lib/store';
import { RecentTrack } from '@/types/recent-tracks';

const getUniqueValues = <T, K extends keyof T>(data: T[], key: K): T[K][] => {
  const values = data
    .slice()
    .reverse()
    .map((item) => item[key])
    .filter(Boolean);
  return Array.from(new Set(values)).reverse();
};

type RecentSongsFiltersProps = {
  data: RecentTrack[];
};

export const RecentSongsFilters = ({ data }: RecentSongsFiltersProps) => {
  const erasOptions = getUniqueValues(data, 'era');
  const noticesOptions = getUniqueValues(data, 'notice');
  const typesOptions = getUniqueValues(data, 'type');
  const qualitiesOptions = getUniqueValues(data, 'quality');
  const availabilitiesOptions = getUniqueValues(data, 'availability');

  const {
    search,
    eras,
    notices,
    types,
    qualities,
    availabilities,
    setSearch,
    setEras,
    setNotices,
    setTypes,
    setAvailabilities,
    setQualities,
    resetFilters,
  } = useRecentSongsFiltersStore();

  return (
    <div className="flex gap-2 px-6 pt-4">
      <Input
        className="h-8 max-w-64 px-2 lg:px-3"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <MultiSelect
        title="Eras"
        options={erasOptions}
        selectedValues={new Set(eras)}
        setSelectedValues={setEras}
      />
      <MultiSelect
        title="Notices"
        options={noticesOptions as string[]}
        selectedValues={new Set(notices)}
        setSelectedValues={setNotices}
      />
      <MultiSelect
        title="Types"
        options={typesOptions}
        selectedValues={new Set(types)}
        setSelectedValues={setTypes}
      />
      <MultiSelect
        title="Qualities"
        options={qualitiesOptions}
        selectedValues={new Set(qualities)}
        setSelectedValues={setQualities}
      />
      <MultiSelect
        title="Availabilities"
        options={availabilitiesOptions}
        selectedValues={new Set(availabilities)}
        setSelectedValues={setAvailabilities}
      />
      <Button
        aria-label="Reset filters"
        variant="ghost"
        className="h-8 px-2 lg:px-3"
        onClick={resetFilters}
      >
        Reset
        <X className="ml-2 size-4" aria-hidden="true" />
      </Button>
    </div>
  );
};
