'use client';

import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function SearchInput(props: { value?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(props.value ?? '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    router.replace(`/player?q=${encodeURIComponent(value)}`);
  }, [router, value]);

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        type="search"
        className="mb-4 h-8 border-[#333] bg-[#1A1A1A] pr-8 text-xs focus-visible:ring-0 [&::-webkit-search-cancel-button]:appearance-none"
        style={{
          WebkitAppearance: 'none',
          MozAppearance: 'none',
          appearance: 'none',
        }}
        placeholder="Search"
        value={value}
        onChange={(e) => {
          setValue(e.currentTarget.value);
        }}
      />
      {value ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 size-6 -translate-y-1/2"
          onClick={() => setValue('')}
        >
          <X className="size-4" />
          <span className="sr-only">Clear search</span>
        </Button>
      ) : (
        <div className="absolute right-2 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center rounded border border-neutral-700 bg-neutral-800 text-neutral-400">
          <span className="font-mono text-xs">/</span>
        </div>
      )}
    </div>
  );
}
