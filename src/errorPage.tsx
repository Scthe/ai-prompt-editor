import { CenteredMain } from 'components';
import React from 'react';
import { useRouteError } from 'react-router-dom';
import cx from 'classnames';

// TODO Add a button that moves back to homepage. I prod this will hopefully happen only when user navigated to `#/giberish`
export default function ErrorPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const error = useRouteError() as any;
  console.error(error);

  return (
    <CenteredMain className="bg-stone-300">
      <div
        className={cx(
          'md:max-w-[50%] w-full p-8',
          'rounded-md bg-white shadow-md text-stone-900',
          'border-[15px] border-red-500'
        )}
      >
        <h1 className="mt-4 mb-4 text-4xl text-center">Error!</h1>
        <p className="mb-10 text-center">
          Sorry, an unexpected error has occurred.
        </p>

        <span className="block mb-1">Logs:</span>
        <p className="px-4 py-2 font-mono text-red-700 rounded-md bg-stone-200">
          <i>{error?.statusText || error?.message}</i>
        </p>
      </div>
    </CenteredMain>
  );
}
