import { SR_IGNORE_SVG } from 'components';
import React, { useCallback, useState } from 'react';
import Icon from '@mdi/react';
import { mdiAlertCircle, mdiCheckBold, mdiContentCopy } from '@mdi/js';
import { IconButton } from 'components/iconButton';
import { copyToClipboard } from 'utils';
import cx from 'classnames';

const COPY_TIMEOUT = 2000;

type States = 'idle' | 'success' | 'error';

export const CopyToClipboardBtn = ({
  id,
  textRef,
  className,
}: {
  id: string;
  textRef: React.MutableRefObject<string> | string;
  className?: string;
}) => {
  const [state, setState] = useState<States>('idle');

  const onCopyToClipboard = useCallback(async () => {
    if (state !== 'idle') return;

    const text = typeof textRef === 'string' ? textRef : textRef.current;
    const copyOk = await copyToClipboard(text);
    setState(copyOk ? 'success' : 'error');

    setTimeout(() => {
      setState('idle');
    }, COPY_TIMEOUT);
  }, [state, textRef]);

  return (
    <IconButton
      id={`copy-btn-${id}`}
      srLabel="Copy to clipboard"
      onClick={onCopyToClipboard}
      className="relative"
    >
      <Icon
        path={mdiContentCopy}
        size={1}
        className={cx(
          `${className} hover:text-sky-500`,
          // animating opacity here has bug on ff where the ":hover" state does not reset
          state === 'idle' ? 'cursor-pointer' : 'invisible'
        )}
        {...SR_IGNORE_SVG}
      />

      <Icon
        path={mdiCheckBold}
        size={1.1}
        className={cx(
          `absolute top-0 left-0 text-green-600 transition-opacity pointer-events-none`,
          state == 'success' ? 'opacity-100' : 'opacity-0'
        )}
        {...SR_IGNORE_SVG}
      />
      <Icon
        path={mdiAlertCircle}
        size={1.1}
        className={cx(
          `absolute top-0 left-0 text-red-600 transition-opacity pointer-events-none`,
          state == 'error' ? 'opacity-100' : 'opacity-0'
        )}
        {...SR_IGNORE_SVG}
      />
    </IconButton>
  );
};
