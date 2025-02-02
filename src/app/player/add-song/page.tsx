'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Loader2, X } from 'lucide-react';
import * as mm from 'music-metadata';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { env } from '@/env.mjs';
import { addSongAction } from '@/features/player/actions';
import { formatDuration } from '@/lib/utils';

const isDevelopment = env.NEXT_PUBLIC_DEVELOPMENT;

export default function AddSongPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadStates, setUploadStates] = useState<
    ('loading' | 'error' | 'success' | null)[]
  >([]);
  const [overideAlbum, setOverideAlbum] = useState<string | null>(null);
  const [type, setType] = useState<string>('Loose Track');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (files.length === 0) return;

    setLoading(true);
    let successCount = 0;
    let errorCount = 0;
    setUploadStates(new Array(files.length).fill(null));

    let coverUrl = undefined;
    for (const [index, file] of files.entries()) {
      const formData = new FormData();
      formData.append('file', file);

      setUploadStates((prevStates) => {
        const newStates = [...prevStates];
        newStates[index] = 'loading';
        return newStates;
      });

      const result = await addSongAction(
        formData,
        overideAlbum !== '' ? overideAlbum : null,
        type,
        coverUrl
      );

      setUploadStates((prevStates) => {
        const newStates = [...prevStates];
        newStates[index] = result?.success ? 'success' : 'error';
        return newStates;
      });

      if (result?.success) {
        successCount++;
        coverUrl = result.coverUrl;
      } else {
        errorCount++;
      }
    }

    setMessage(
      `${successCount} file(s) uploaded successfully, ${errorCount} failed.`
    );
    setLoading(false);
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      setFiles([...files, ...Array.from(event.target.files)]);
    }
  }

  function removeFile(index: number) {
    setFiles(files.filter((_, i) => i !== index));
  }

  async function getMetadata(file: File) {
    const buffer = Buffer.from(await file.arrayBuffer());
    return await mm.parseBuffer(buffer, file.type);
  }

  if (!isDevelopment) {
    return <div>Upload is disabled in production.</div>;
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-[#0A0A0A] pb-[69px]">
      <div className="flex items-center justify-between bg-[#0A0A0A] p-3">
        <div className="flex items-center space-x-1">
          <Link href="/player" passHref>
            <Button variant="ghost" size="icon" className="size-7">
              <ChevronLeft className="size-4" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="size-7" disabled>
            <ChevronRight className="size-4" />
          </Button>
          <span className="text-sm">Add Songs</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="h-7 text-xs"
              size="sm"
            >
              Select File
            </Button>
            {files.length > 0 && (
              <Button
                onClick={() => {
                  setFiles([]);
                  setUploadStates([]);
                  setMessage(null);
                }}
                variant="ghost"
                className="h-7 text-xs"
                size="sm"
              >
                Clear
              </Button>
            )}
            <Input
              type="text"
              placeholder="Album"
              value={overideAlbum || ''}
              onChange={(event) => setOverideAlbum(event.target.value)}
              className="h-7 w-36 !text-xs focus-visible:ring-0"
            />
            <Select onValueChange={setType} defaultValue={type}>
              <SelectTrigger className="h-7 w-36 text-xs">
                <SelectValue placeholder="Loose Track" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Loose Track">Loose Track</SelectItem>
                <SelectItem value="Features">Features</SelectItem>
                <SelectItem value="Edit & Remasters">
                  Edit & Remasters
                </SelectItem>
                <SelectItem value="Official Project">
                  Official Project
                </SelectItem>
                <SelectItem value="Demo">Demo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <input
            type="file"
            className="hidden"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <div className="flex items-center gap-4">
            {message && (
              <span className="text-xs text-gray-400">{message}</span>
            )}
            <Button
              type="submit"
              variant="secondary"
              className="h-7 bg-[#282828] text-xs text-white hover:bg-[#3E3E3E]"
              disabled={loading}
            >
              {loading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        </div>
      </form>

      <ScrollArea className="flex-1 px-4 py-3">
        <div className="min-w-max">
          <TrackTable
            files={files}
            removeFile={removeFile}
            getMetadata={getMetadata}
            uploadStates={uploadStates}
          />
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}

const TrackTable = ({
  files,
  removeFile,
  getMetadata,
  uploadStates,
}: {
  files: File[];
  removeFile: (index: number) => void;
  getMetadata: (file: File) => Promise<mm.IAudioMetadata>;
  uploadStates: ('loading' | 'error' | 'success' | null)[];
}) => {
  return (
    <table className="w-full text-xs">
      <thead className="sticky top-0 z-10 border-b border-[#282828] bg-[#0A0A0A]">
        <tr className="text-left text-gray-400">
          <th className="w-10 py-2 pl-3 pr-2 font-medium">#</th>
          <th className="p-2 font-medium">Title</th>
          <th className="hidden p-2 font-medium sm:table-cell">Artist</th>
          <th className="hidden p-2 font-medium md:table-cell">Album</th>
          <th className="p-2 font-medium">Duration</th>
          <th className="w-8 p-2 font-medium"></th>
        </tr>
      </thead>
      <tbody className="mt-px">
        {files.map((file, index) => (
          <TrackRow
            key={index}
            file={file}
            index={index}
            removeFile={removeFile}
            getMetadata={getMetadata}
            state={uploadStates[index]}
          />
        ))}
      </tbody>
    </table>
  );
};

const TrackRow = ({
  file,
  index,
  removeFile,
  getMetadata,
  state,
}: {
  file: File;
  index: number;
  removeFile: (index: number) => void;
  getMetadata: (file: File) => Promise<mm.IAudioMetadata>;
  state: 'loading' | 'error' | 'success' | null;
}) => {
  const [metadata, setMetadata] = useState<mm.IAudioMetadata | null>(null);

  useEffect(() => {
    getMetadata(file).then(setMetadata);
  }, [file, getMetadata]);

  if (!metadata) {
    return null;
  }

  return (
    <tr className="group relative cursor-pointer hover:bg-[#1A1A1A]">
      <td className="py-2 pl-3 pr-2">
        <StateOrIndex state={state} index={index} />
      </td>
      <td className="p-2">{metadata.common.title}</td>
      <td className="hidden p-2 sm:table-cell">{metadata.common.artist}</td>
      <td className="hidden p-2 md:table-cell">{metadata.common.album}</td>
      <td className="p-2">
        {metadata.format.duration
          ? formatDuration(metadata.format.duration)
          : 0}
      </td>
      <td className="w-8 p-2">
        <Button
          variant="ghost"
          size="icon"
          className="size-5"
          onClick={() => removeFile(index)}
        >
          <X className="size-3 text-gray-400" />
          <span className="sr-only">Remove</span>
        </Button>
      </td>
    </tr>
  );
};
const StateOrIndex = ({
  state,
  index,
}: {
  state: 'loading' | 'error' | 'success' | null;
  index: number;
}) => {
  switch (state) {
    case 'loading':
      return <Loader2 className="size-4 animate-spin text-neutral-600" />;
    case 'error':
      return <X className="size-4 text-red-500" />;
    case 'success':
      return <Check className="size-4 text-green-500" />;
    default:
      return index + 1;
  }
};
