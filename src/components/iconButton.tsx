import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  id: string;
  srLabel: string;
}

/** Please use `{...SR_IGNORE_SVG}` as attributes for the icon! */
export const IconButton = ({ id, srLabel, children, ...rest }: Props) => {
  return (
    <button type="button" aria-labelledby={id} {...rest}>
      {children}
      <span id={id} className="sr-only" hidden>
        {srLabel}
      </span>
    </button>
  );
};
