import React from 'react';
import { FusePageCarded } from '@fuse';
import withReducer from 'app/store/withReducer';

import ClubsHeader from "./ClubsHeader";

function Clubs() {
  return (
    <FusePageCarded
      classes={{
        content: "flex",
        header : "min-h-72 h-72 sm:h-136 sm:min-h-136"
      }}
      header={
        <ClubsHeader />
      }
    />
  )
}

export default withReducer()(Clubs)
