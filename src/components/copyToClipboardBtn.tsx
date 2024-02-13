import { SR_IGNORE_SVG } from 'components';
import React, { useCallback, useEffect, useState } from 'react';
import Icon from '@mdi/react';
import { mdiAlertCircle, mdiCheckBold, mdiContentCopy } from '@mdi/js';
import { IconButton } from 'components/iconButton';
import { copyToClipboard, s2ms } from 'utils';
import cx from 'classnames';
import styles from './copyToClipboardBtn.module.css';
import { useAnimate } from 'framer-motion';
import { ANIMATION_SPEED } from 'animation';

const COPY_TIMEOUT = s2ms(2);

type States = 'idle' | 'success' | 'error';

const ELEMENT_ID = {
  CopyBtn: 'copy-btn-id',
  SuccesIcon: 'success-icon-id',
  ErrorIcon: 'error-icon-id',
};

export const CopyToClipboardBtn = ({
  id,
  textRef,
  className,
  tooltip,
}: {
  id: string;
  textRef: React.MutableRefObject<string> | string;
  className?: string;
  tooltip?: string;
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

  // animation. Animating SVG through CSS has errors (e.g. hover state likes to persist).
  const [scope, animate] = useAnimate();
  useEffect(() => {
    const duration = ANIMATION_SPEED.fast;

    if (state === 'idle') {
      animate([
        [`.${ELEMENT_ID.SuccesIcon}`, { opacity: 0 }, { duration }],
        [`.${ELEMENT_ID.ErrorIcon}`, { opacity: 0 }, { duration, at: '<' }],
        [
          `.${ELEMENT_ID.CopyBtn}`,
          { opacity: 1 },
          { duration, delay: duration }, // extra delay for extra clarity
        ],
      ]).play();
    } else {
      const successOpacity = state === 'success' ? 1 : 0;
      const errorOpacity = state === 'error' ? 1 : 0;
      animate([
        [`.${ELEMENT_ID.CopyBtn}`, { opacity: 0 }, { duration }],
        [
          `.${ELEMENT_ID.SuccesIcon}`,
          { opacity: successOpacity },
          { duration },
        ],
        [
          `.${ELEMENT_ID.ErrorIcon}`,
          { opacity: errorOpacity },
          { duration, at: '<' },
        ],
      ]).play();
    }
  }, [animate, scope, state]);

  return (
    <IconButton
      ref2={scope}
      id={`copy-btn-${id}`}
      srLabel="Copy to clipboard"
      onClick={onCopyToClipboard}
      className={cx('relative', state !== 'idle' && 'pointer-events-none')}
      title={tooltip || 'Copy to clipboard'}
    >
      <Icon
        path={mdiContentCopy}
        size={1}
        className={cx(
          ELEMENT_ID.CopyBtn,
          `${className} hover:text-sky-500`,
          state === 'idle' && 'cursor-pointer'
        )}
        {...SR_IGNORE_SVG}
      />

      <Icon
        path={mdiCheckBold}
        size={1.0}
        className={cx(
          styles.animatedIcon,
          ELEMENT_ID.SuccesIcon,
          `text-green-600 opacity-0`
        )}
        {...SR_IGNORE_SVG}
      />
      <Icon
        path={mdiAlertCircle}
        size={1.0}
        className={cx(
          styles.animatedIcon,
          ELEMENT_ID.ErrorIcon,
          `text-red-600 opacity-0`
        )}
        {...SR_IGNORE_SVG}
      />
    </IconButton>
  );
};
