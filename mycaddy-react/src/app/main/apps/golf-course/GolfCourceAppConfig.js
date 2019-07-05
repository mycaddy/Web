import React from 'react';
import { Redirect } from 'react-router-dom';

export const GolfCourceAppConfig = {
  settings: {
    layout: {}
  },
  routes: [
    {
      path: '/apps/golf-course/countries',
      component: React.lazy(() => import('./countries/Countries'))
    },
    {
      path: '/apps/golf-course/courses',
      component: React.lazy(() => import('./courses/Courses'))
    },
    {
      path: '/apps/golf-course/clubs',
      component: React.lazy(() => import('./clubs/Clubs'))
    },
    {
      path: '/apps/golf-course',
      component: () => <Redirect to="/apps/golf-course/courses" />
    }
  ]
};
