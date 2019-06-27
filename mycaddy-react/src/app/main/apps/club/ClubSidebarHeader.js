import React, { useState, useEffect } from 'react';
import Select from 'react-select'
import { Icon, Box } from '@material-ui/core';
import { FuseAnimate } from '@fuse';
import countries from '../../../../@fake-db/db/countries.json'

const suggetions = countries.map(country => ({
  value: country.ISO3166_1_numeric,
  label: country.display_name
}))

function ClubSidebarHeader() {
  const [selectedAccount, setSelectedCount] = useState('creapond');

  useEffect(() => {
   console.log('useEffect', suggetions) 
  })
  

  function handleAccountChange(ev) {
    setSelectedCount(ev.target.value);
  }

  const selectData = {
    'creapond'    : 'johndoe@creapond.com',
    'withinpixels': 'johndoe@withinpixels.com'
  };

  return (
    <div className="flex flex-col justify-center h-full p-24">

      <div className="flex items-center flex-1">
        <FuseAnimate animation="transition.expandIn" delay={300}>
          <Icon className="text-32 mr-16">flag</Icon>
        </FuseAnimate>
        <FuseAnimate animation="transition.slideLeftIn" delay={300}>
          <span className="text-24">Club</span>
        </FuseAnimate>
      </div>
      <FuseAnimate animation="transition.slideUpIn" delay={300}>
        <Box id="select-box" elevation={200}>
          <Select 
            options={suggetions}
          />
        </Box>
        {/** 
        <TextField
          id="account-selection"
          select
          label="Countries"
          value={selectedAccount}
          onChange={handleAccountChange}
          placeholder="Select Account"
          margin="normal"
        >
          {countries.map((country) =>(
            <MenuItem key={country.ISO3166_1_numeric} value={country.ISO3166_1_numeric}>
            {country.display_name}
            </MenuItem>
          ))}
        </TextField>
        */}
      </FuseAnimate>

    </div>
  );
}

export default ClubSidebarHeader;
