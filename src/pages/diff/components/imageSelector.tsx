import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import cx from 'classnames';
import { AiImageExif, parseExif } from 'utils/exifParser';
import { PromptId } from '../types';
import { mdiClose } from '@mdi/js';
import Icon from '@mdi/react';
import { IconButton, SR_IGNORE_SVG } from 'components';
import { SectionHeader } from './text';
import { AnimatePresence, AnimationProps, motion } from 'framer-motion';
import { ANIMATION_SPEED } from 'animation';

export type PromptImage = AiImageExif &
  Required<Pick<AiImageExif, 'rawAiParams' | 'aiParams'>>;

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

  const ANIM_PROPS: AnimationProps = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: ANIMATION_SPEED.medium },
  };

  return (
    <div
      className={cx(
        `transition-colors group`,
        // when not dragging
        isIdle && 'hover:bg-sky-100 cursor-pointer',
        isIdle && !preview && 'bg-gray-100 text-gray-600',
        // drag response
        isDragAccept && 'bg-sky-500 text-white',
        isDragReject && 'bg-red-500 text-white'
      )}
    >
      <AnimatePresence mode="sync" initial={false}>
        {preview ? (
          <motion.div
            key="preview"
            className="flex items-center justify-center"
            {...ANIM_PROPS}
          >
            <ImagePreview preview={preview} />
          </motion.div>
        ) : (
          <motion.p
            key="no-img-text"
            className={cx(
              'text-sm flex items-center justify-center transition-colors',
              'h-[150px] border-4 border-dashed rounded-sm', // graybox
              // border states:
              'group-hover:border-sky-500',
              isDragAccept && 'border-sky-100',
              isDragReject && 'border-red-100',
              isIdle && 'border-gray-400'
            )}
            {...ANIM_PROPS}
          >
            Select an AI generated image to extract Exif data
          </motion.p>
        )}
      </AnimatePresence>
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
