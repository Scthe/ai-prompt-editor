import React from 'react';
import cx from 'classnames';
import { mdiTriangle, mdiTriangleDown } from '@mdi/js';
import Icon from '@mdi/react';
import { SortOrder } from 'utils';

type TableProps = React.JSX.IntrinsicElements['table'] &
  React.PropsWithChildren<{ id: string; caption: string }>;

export const Table = ({ id, caption, children, ...rest }: TableProps) => {
  return (
    <table tabIndex={0} {...rest}>
      <caption id={`${id}-caption`} className="sr-only">
        {caption}
      </caption>
      {children}
    </table>
  );
};

export const TableHeaderRow = ({
  className,
  children,
}: React.PropsWithChildren<{ className?: string }>) => {
  return (
    <thead>
      <tr className={cx('text-center bg-zinc-100 text-zinc-800', className)}>
        {children}
      </tr>
    </thead>
  );
};

export const TableSortIcons = ({
  isVisible,
  order,
}: {
  isVisible: boolean;
  order: SortOrder;
}) => {
  return isVisible ? (
    <Icon
      className="inline-block ml-1 translate-y-[-2px]"
      path={order === 'asc' ? mdiTriangle : mdiTriangleDown}
      size={0.5}
    />
  ) : undefined;
};

export const TableRow = ({
  className,
  isMobileLayout,
  children,
}: React.PropsWithChildren<{
  className?: string;
  isMobileLayout: boolean;
}>) => {
  return (
    <tr
      className={cx(
        'alternateRow hover:bg-accent-200 hover:dark:bg-accent-950',
        isMobileLayout ? 'flex flex-col p-2' : '',
        className
      )}
    >
      {children}
    </tr>
  );
};

export const TableMobileLabel = ({
  label,
  isMobileLayout,
}: {
  label: string;
  isMobileLayout: boolean;
}) => {
  return isMobileLayout ? (
    <span className="inline-block mr-2">{label}:</span>
  ) : undefined;
};
