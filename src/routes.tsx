import React from 'react';
import { RouteObject } from 'react-router-dom';
import DiffPage from 'pages/diff';

type RouteDef = RouteObject & Required<Pick<RouteObject, 'path'>>;

export const ROUTES: Array<RouteDef> = [
  {
    path: 'diff',
    element: <DiffPage />,
  },
];
