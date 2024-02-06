import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import cx from 'classnames';
import { AiImageExif, parseExif } from 'utils/exifParser';
import { PromptId } from '../types';
import { mdiClose } from '@mdi/js';
import Icon from '@mdi/react';
import { IconButton, SR_IGNORE_SVG } from 'components';

export type PromptImage = AiImageExif &
  Required<Pick<AiImageExif, 'rawAiParams' | 'aiParams'>>;

// TODO allow drag and drop even when there is image currently
// TODO move 'x' to header row instead on top of the image
export const ImageSelector = ({
  id,
  onImageSelected,
  className,
}: {
  id: PromptId;
  onImageSelected: (file: PromptImage | undefined) => void;
  className?: string;
}) => {
  const [error, setError] = useState<string | undefined>();
  const [preview, setPreview] = useState<string | undefined>();

  const { getRootProps, getInputProps, isDragAccept, isDragReject } =
    useDropzone({
      maxFiles: 1,
      multiple: false,
      accept: { 'image/*': [] },
      onDropAccepted: async (files) => {
        const file = files[0];
        if (!file) return;

        const result = await parseExif(file);
        if (!result.aiParams) {
          setError(`Error: This image does not contain required Exif data`);
          return;
        }

        setError(undefined);
        setPreview(URL.createObjectURL(file));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onImageSelected(result as any); // already checked 'result.aiParams'
      },
      onDropRejected: (e) => {
        const errMsg = e[0]?.errors?.[0]?.message;
        setError(`Error: ${errMsg || 'Invalid file'}`);
      },
    });

  const isIdle = !isDragAccept && !isDragReject;

  const removeCurrentImage = useCallback(() => {
    setPreview(undefined);
    onImageSelected(undefined);
  }, [onImageSelected]);

  if (preview) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <img
          src={preview}
          className="h-[200px]"
          // Revoke data uri after image is loaded
          onLoad={() => {
            URL.revokeObjectURL(preview);
          }}
        />

        {/* cancel btn */}
        <div className="absolute top-0 right-0 shadow-xl rounded-bl-md w-fit bg-zinc-100">
          <IconButton
            id={`remove-preview-${id}`}
            srLabel="Remove image"
            onClick={removeCurrentImage}
            className="transition-colors cursor-pointer hover:bg-sky-100"
          >
            <Icon
              path={mdiClose}
              size={1}
              className={`hover:text-red-500 cursor-pointer`}
              {...SR_IGNORE_SVG}
            />
          </IconButton>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div {...getRootProps()}>
        <div
          className={cx(
            `h-[100px]  flex items-center justify-center border-4 border-dashed rounded-sm transition-colors `,
            isDragAccept && 'bg-sky-500 border-sky-400 text-white',
            isDragReject && 'bg-red-500 border-red-400 text-white',
            isIdle &&
              'bg-gray-100 border-gray-400 text-gray-600 hover:bg-sky-100 hover:border-sky-500 cursor-pointer'
          )}
        >
          <input {...getInputProps()} />
          <p className="text-sm">
            Select an AI generated image to extract Exif data
          </p>
        </div>
      </div>
      {/* TODO aria-alert? */}
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
};
