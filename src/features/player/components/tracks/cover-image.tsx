'use client';

import { useActionState } from 'react';
import { Loader2, Upload } from 'lucide-react';

import { uploadPlaylistCoverAction } from '@/features/player/actions';

export function CoverImage({
  url,
  playlistId,
}: {
  url: string | null;
  playlistId: string;
}) {
  const [state, formAction, pending] = useActionState(
    uploadPlaylistCoverAction,
    {
      success: false,
      coverUrl: '',
    }
  );

  const currentUrl = state?.success ? state.coverUrl : url;

  if (currentUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={currentUrl}
        alt="Playlist cover"
        className="size-16 object-cover sm:size-20"
      />
    );
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="playlistId" value={playlistId} />
      <label
        htmlFor="coverUpload"
        className="flex size-16 cursor-pointer flex-col items-center justify-center rounded border border-dashed border-neutral-700 text-white sm:size-20"
      >
        <input
          id="coverUpload"
          type="file"
          name="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              if (file.size <= 5 * 1024 * 1024) {
                e.target.form?.requestSubmit();
              } else {
                alert('File size exceeds 5MB limit');
                e.target.value = '';
              }
            }
          }}
        />
        {pending ? (
          <Loader2 className="size-5 animate-spin text-neutral-600" />
        ) : (
          <>
            <Upload className="mb-1 size-3" />
            <span className="text-center text-xs">Upload</span>
          </>
        )}
      </label>
    </form>
  );
}
