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
          contentWrapper: "p-0 sm:p-24 pb-80 sm:pb-80 h-full",
          content: "flex flex-col h-full",
          header : "min-h-50 h-50 sm:h-114 sm:min-h-114"
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
