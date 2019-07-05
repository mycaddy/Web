import React from 'react'
import { Redirect } from 'react-router-dom'
import { FuseUtils } from '@fuse'
import { ExampleConfig } from 'app/main/example/ExampleConfig'
import { pagesConfigs } from 'app/main/pages/pagesConfigs'
import { LoginConfig } from 'app/main/login/LoginConfig'
import { appsConfigs } from "app/main/apps/appsConfigs";

import { GolfCourceAppConfig } from "app/main/apps/golf-course/GolfCourceAppConfig";


import { TodoAppConfig } from 'app/main/apps/todo/TodoAppConfig'
import { clubAppConfig } from 'app/main/apps/club/ClubAppConfig'
import { ECommerceAppConfig } from "app/main/apps/e-commerce/ECommerceAppConfig";



const routeConfigs = [
  ...pagesConfigs,
  LoginConfig,
  ...appsConfigs,
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
