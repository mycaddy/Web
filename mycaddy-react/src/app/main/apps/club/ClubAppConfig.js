import React from 'react';
import { Redirect } from 'react-router-dom';

export const clubAppConfig = {
  settings: {
    layout: {}
  },
  routes: [
    {
      path: [
        '/apps/club/label/:labelHandle/:clubId?',
        '/apps/club/filter/:filterHandle/:clubId?',
        '/apps/club/:folderHandle/:clubId?'
      ],
      component: React.lazy(() => import('./ClubApp'))
    },
    {
      path: '/apps/club',
      component: () => <Redirect to="/apps/club/all" />
    }
  ]
};
