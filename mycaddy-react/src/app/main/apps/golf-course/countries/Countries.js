import React from 'react';
import { FusePageCarded } from '@fuse';
import withReducer from 'app/store/withReducer';

import CountriesHeader from "./CountriesHeader";
import CountryList from "./CountryList";
import CountryDialog from "./CountryDialog";
import reducer from './store/reducers';

function Countries() {
  return (
    <>
      <FusePageCarded
        classes={{
          content: "flex",
          header : "min-h-72 h-72 sm:h-136 sm:min-h-136"
        }}
        header={
          <CountriesHeader />
        }
        content={
          <CountryList />
        }
      />
      <CountryDialog />
    </>
  )
}

export default withReducer('countriesApp', reducer)(Countries)
