import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  id: string;
  srLabel: string;
  ref2?: React.LegacyRef<HTMLButtonElement>;
}

/** Please use `{...SR_IGNORE_SVG}` as attributes for the icon! */
export const IconButton = ({ ref2, id, srLabel, children, ...rest }: Props) => {
  return (
    <button
      type="button"
      aria-labelledby={id}
      ref={ref2}
      title={srLabel}
      {...rest}
    >
      {children}
      <span id={id} className="sr-only" hidden>
        {srLabel}
      </span>
    </button>
  );
};
