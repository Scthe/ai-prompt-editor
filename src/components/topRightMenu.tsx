import React from 'react';
import cx from 'classnames';
import Icon from '@mdi/react';
import { mdiArrowRight } from '@mdi/js';
import { SR_IGNORE_SVG } from 'components';

type TargetPage = 'diff' | 'editor';

const PerPageData: Record<TargetPage, { label: string; href: string }> = {
  diff: { label: 'Diff tool', href: '#/diff/' },
  editor: { label: 'Prompt editor', href: '#/' },
};

export const TopRightMenu = ({ targetPage }: { targetPage: TargetPage }) => {
  const { label, href } = PerPageData[targetPage];

  return (
    <div className="fixed top-0 right-0">
      <div className="relative text-gray-900 capitalize shadow-xl rounded-bl-md w-fit bg-zinc-100">
        <a
          href={href}
          className={cx(
            'block px-8 py-2 relative transition-colors cursor-pointer hover:bg-sky-100'
          )}
        >
          <span>{label}</span>
          <Icon
            path={mdiArrowRight}
            size={1}
            className="inline-block ml-2 -translate-y-[2px]"
            {...SR_IGNORE_SVG}
          />
        </a>
      </div>
    </div>
  );
};
