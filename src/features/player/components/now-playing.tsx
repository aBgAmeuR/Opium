/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useRef, useState } from 'react';
import { useActionState } from 'react';
import { CheckIcon, Loader2, PencilIcon } from 'lucide-react';

import { updateTrackAction, updateTrackImageAction } from '../actions';
import { usePlayback } from './playback/playback-context';

import { cn } from '@/lib/utils';

export function NowPlaying() {
  const { currentTrack } = usePlayback();
  const [imageState, imageFormAction, imagePending] = useActionState(
    updateTrackImageAction,
    {
      success: false,
      imageUrl: '',
    }
  );
  const [showPencil, setShowPencil] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    // Delay showing the edit icon
    // When transitioning from pending back to finished
    if (!imagePending) {
      timer = setTimeout(() => {
        setShowPencil(true);
      }, 300);
    } else {
      setShowPencil(false);
    }
    return () => clearTimeout(timer);
  }, [imagePending]);

  if (!currentTrack) {
    return null;
  }

  const currentImageUrl = imageState?.success
    ? imageState.imageUrl
    : currentTrack.imageUrl;

  return (
    <div className="hidden w-56 flex-col overflow-auto bg-[#121212] p-4 md:flex">
      <h2 className="mb-3 text-sm font-semibold text-gray-200">Now Playing</h2>
      <div className="group relative mb-3 aspect-square w-full">
        <img
          src={currentImageUrl || '/placeholder.svg'}
          alt={currentTrack.name}
          className="size-full object-cover"
        />
        <form action={imageFormAction} className="absolute inset-0">
          <input type="hidden" name="trackId" value={currentTrack.id} />
          <label
            htmlFor="imageUpload"
            className="absolute inset-0 flex cursor-pointer items-center justify-center"
          >
            <input
              id="imageUpload"
              type="file"
              name="file"
              className="hidden"
              accept="image/*"
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
            <div
              // eslint-disable-next-line tailwindcss/migration-from-tailwind-2
              className={cn(
                'rounded-full p-2 group-hover:bg-black group-hover:bg-opacity-50',
                imagePending && 'bg-opacity-50'
              )}
            >
              {imagePending ? (
                <Loader2 className="size-6 animate-spin text-white" />
              ) : (
                showPencil && (
                  <PencilIcon className="size-6 text-white opacity-0 transition-opacity group-hover:opacity-100" />
                )
              )}
            </div>
          </label>
        </form>
      </div>
      <div className="w-full space-y-1">
        <EditableInput
          initialValue={currentTrack.name}
          trackId={currentTrack.id}
          field="name"
          label="Title"
        />
        <EditableInput
          initialValue={currentTrack.artist}
          trackId={currentTrack.id}
          field="artist"
          label="Artist"
        />
        <EditableInput
          initialValue={currentTrack.genre || ''}
          trackId={currentTrack.id}
          field="genre"
          label="Genre"
        />
        <EditableInput
          initialValue={currentTrack.album || ''}
          trackId={currentTrack.id}
          field="album"
          label="Album"
        />
        <EditableInput
          initialValue={currentTrack.type || ''}
          trackId={currentTrack.id}
          field="type"
          label="Type"
        />
        <EditableInput
          initialValue={currentTrack.bpm?.toString() || ''}
          trackId={currentTrack.id}
          field="bpm"
          label="BPM"
        />
        <EditableInput
          initialValue={currentTrack.key || ''}
          trackId={currentTrack.id}
          field="key"
          label="Key"
        />
      </div>
    </div>
  );
}

interface EditableInputProps {
  initialValue: string;
  trackId: string;
  field: string;
  label: string;
}

export function EditableInput({
  initialValue,
  trackId,
  field,
  label,
}: EditableInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [showCheck, setShowCheck] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(updateTrackAction, {
    success: false,
    error: '',
  });

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    setValue(initialValue);
    setIsEditing(false);
    setShowCheck(false);
  }, [initialValue, trackId]);

  useEffect(() => {
    if (state.success) {
      setShowCheck(true);
      const timer = setTimeout(() => {
        setShowCheck(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.success]);

  function handleSubmit() {
    if (value.trim() === '' || value === initialValue) {
      setIsEditing(false);
      return;
    }

    formRef.current?.requestSubmit();
    setIsEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setValue(initialValue);
    }
  }

  return (
    <div className="group space-y-1">
      <label
        htmlFor={`${field}-input`}
        className="text-muted-foreground text-xs"
      >
        {label}
      </label>
      <div className="flex h-3 w-full items-center justify-between border-b border-transparent text-xs transition-colors focus-within:border-white">
        {isEditing ? (
          <form ref={formRef} action={formAction} className="w-full">
            <input type="hidden" name="trackId" value={trackId} />
            <input type="hidden" name="field" value={field} />
            <input
              ref={inputRef}
              id={`${field}-input`}
              type="text"
              name={field}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSubmit}
              className={cn(
                'w-full bg-transparent p-0 focus:outline-none',
                state.error && 'text-red-500'
              )}
              aria-invalid={state.error ? 'true' : 'false'}
              aria-describedby={state.error ? `${field}-error` : undefined}
            />
          </form>
        ) : (
          <div
            className="block w-full cursor-pointer truncate"
            onClick={() => setIsEditing(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setIsEditing(true);
              }
            }}
            aria-label={`Edit ${label}`}
          >
            <span className={cn(value ? '' : 'text-muted-foreground')}>
              {value || '-'}
            </span>
          </div>
        )}
        <div className="flex items-center">
          {pending ? (
            <Loader2 className="size-3 animate-spin" />
          ) : showCheck ? (
            <CheckIcon className="size-3 text-green-500" />
          ) : (
            !isEditing && (
              <PencilIcon className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
            )
          )}
        </div>
      </div>
      {state.error && (
        <p id={`${field}-error`} className="text-xs text-red-500">
          {state.error}
        </p>
      )}
    </div>
  );
}
