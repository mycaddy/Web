import React, { useState, useEffect } from 'react';
import Select from 'react-select'
import { Icon, Box, FormLabel } from '@material-ui/core';
import { withStyles, createMuiTheme, useTheme } from '@material-ui/core/styles';
import { FuseAnimate } from '@fuse';
import countries from '../../../../@fake-db/db/countries.json'

const suggetions = countries.map(country => ({
  value: country.ISO3166_1_numeric,
  label: country.display_name
}))

// Test code for view theme ----------------------------
const styles = theme => console.log(theme) || ({
  bold: {
    fontWeight: 'bold',
  }
});
// ------------------------------------------------------


function ClubSidebarHeader() {
  const [selectedAccount, setSelectedCount] = useState('creapond');
  
  useEffect(() => {
   // console.log('useEffect', suggetions) 
  })
  
  function handleAccountChange(ev) {
    setSelectedCount(ev.target.value);
  }

  const selectData = {
    'creapond'    : 'johndoe@creapond.com',
    'withinpixels': 'johndoe@withinpixels.com'
  };

  const theme = useTheme()
  const selectStyles = {
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? theme.palette.action.active : theme.palette.primary[200],
      background: theme.palette.primary[500]
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: theme.palette.action.active
    })
    ,
    control: (provided, state) => ({
      ...provided,
      background: theme.palette.primary[500]
    }),
  }

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
      {/** 
      <FuseAnimate animation="transition.slideUpIn" delay={300}>
        <Box id="select-box">
          <FormLabel component="legend" className="pb-3">Countries</FormLabel>
          <Select
            options={suggetions}
            styles={selectStyles}
          />
        </Box>
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
      </FuseAnimate>
      */}
    </div>
  );
}

export default withStyles(styles)(ClubSidebarHeader);
