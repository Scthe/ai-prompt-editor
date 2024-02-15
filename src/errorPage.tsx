import { CenteredMain } from 'components';
import React from 'react';
import { useRouteError } from 'react-router-dom';
import cx from 'classnames';

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
          <br />
          Do you want to{' '}
          <a
            className="text-gray-700 transition-colors border-b-4 cursor-pointer hover:text-gray-900 hover:border-accent-500 border-accent-300"
            href="/#"
          >
            go back
          </a>
          ?
        </p>

        <span className="block mb-1">Logs:</span>
        <p className="px-4 py-2 font-mono text-red-700 rounded-md bg-stone-200">
          <i>{error?.statusText || error?.message}</i>
        </p>
      </div>
    </CenteredMain>
  );
}
