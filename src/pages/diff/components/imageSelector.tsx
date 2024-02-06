import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import cx from 'classnames';
import { AiImageExif, parseExif } from 'utils/exifParser';
import { PromptId } from '../types';
import { mdiClose } from '@mdi/js';
import Icon from '@mdi/react';
import { IconButton, SR_IGNORE_SVG } from 'components';
import { SectionHeader } from './text';

export type PromptImage = AiImageExif &
  Required<Pick<AiImageExif, 'rawAiParams' | 'aiParams'>>;

// TODO load from url?
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

  const removeCurrentImage = useCallback(() => {
    setPreview(undefined);
    onImageSelected(undefined);
  }, [onImageSelected]);

  return (
    <>
      <SectionHeader
        actions={
          preview ? (
            <RemoveImageBtn id={id} removeCurrentImage={removeCurrentImage} />
          ) : undefined
        }
      >
        Read from image
      </SectionHeader>

      <div className={`${className} cursor-pointer`}>
        <div {...getRootProps()}>
          <input {...getInputProps()} />

          <DropZoneContent
            isDragAccept={isDragAccept}
            isDragReject={isDragReject}
            preview={preview}
          />
        </div>
        {/* TODO aria-alert? */}
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </div>
    </>
  );
};

const ImagePreview = ({ preview }: { preview: string }) => {
  return (
    <img
      src={preview}
      className="h-[200px]"
      // Revoke data uri after image is loaded
      onLoad={() => {
        URL.revokeObjectURL(preview);
      }}
    />
  );
};

const DropZoneContent = ({
  isDragAccept,
  isDragReject,
  preview,
}: {
  isDragAccept: boolean;
  isDragReject: boolean;
  preview: string | undefined;
}) => {
  const isIdle = !isDragAccept && !isDragReject;

  return (
    <div
      className={cx(
        `flex items-center justify-center transition-colors`,
        // drag response
        isDragAccept && 'bg-sky-500 border-sky-400 text-white',
        isDragReject && 'bg-red-500 border-red-400 text-white',
        // graybox
        !preview && 'h-[100px] border-4 border-dashed rounded-sm',
        isIdle && 'hover:bg-sky-100 hover:border-sky-500 cursor-pointer',
        isIdle && !preview && 'bg-gray-100 border-gray-400 text-gray-600 '
      )}
    >
      {preview ? (
        <ImagePreview preview={preview} />
      ) : (
        <p className="text-sm">
          Select an AI generated image to extract Exif data
        </p>
      )}
    </div>
  );
};

const RemoveImageBtn = ({
  id,
  removeCurrentImage,
}: {
  id: string;
  removeCurrentImage: () => void;
}) => {
  return (
    <IconButton
      id={`remove-preview-${id}`}
      srLabel="Remove image"
      onClick={removeCurrentImage}
    >
      <Icon
        path={mdiClose}
        size={1}
        className={`hover:text-red-500 cursor-pointer transition-colors`}
        {...SR_IGNORE_SVG}
      />
    </IconButton>
  );
};
