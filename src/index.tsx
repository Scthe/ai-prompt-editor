import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Outlet, RouterProvider, createHashRouter } from 'react-router-dom';
import ErrorPage from 'errorPage';
import { ROUTES } from 'routes';
import { isProductionBuild } from 'utils';
import EditorPage from 'pages/editor';
import { loadInitialColorAccent } from 'hooks/useColorAccent';

(function () {
  if (!isProductionBuild()) {
    // eslint-disable-next-line no-console
    console.log('Starting esbuild live reload');
    new EventSource('/esbuild').addEventListener('change', () =>
      location.reload()
    );
  }
})();

loadInitialColorAccent();

const router = createHashRouter([
  {
    path: '/',
    element: <Outlet />,
    errorElement: <ErrorPage />,
    children: [{ index: true, element: <EditorPage /> }, ...ROUTES],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
