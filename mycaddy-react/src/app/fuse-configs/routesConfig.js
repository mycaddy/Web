import React from 'react'
import { Redirect } from 'react-router-dom'
import { FuseUtils } from '@fuse'
import { ExampleConfig } from 'app/main/example/ExampleConfig'
import { pagesConfigs } from 'app/main/pages/pagesConfigs'
import { LoginConfig } from 'app/main/login/LoginConfig'
// import { TodoAppConfig } from 'app/main/apps/todo/TodoAppConfig'
import { clubAppConfig } from 'app/main/apps/club/ClubAppConfig'

const routeConfigs = [
  ...pagesConfigs,
  LoginConfig,
  // TodoAppConfig,
  clubAppConfig,
  ExampleConfig
];

const routes = [
  ...FuseUtils.generateRoutesFromConfigs(routeConfigs),
  {
    path: '/',
    exact: true,
    component: () => <Redirect to="/apps/club" />
  },
  {
    component: () => <Redirect to="/pages/errors/error-404" />
  }
];

export default routes;
