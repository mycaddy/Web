import React from 'react'
import { Icon, List, ListItem, ListItemText, ListSubheader, Button, Box, FormLabel } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/styles'
import { useDispatch, useSelector } from 'react-redux'
import * as Actions from './store/actions'
import { FuseAnimate, NavLinkAdapter } from '@fuse'
import countries from '../../../../@fake-db/db/countries.json'
import Select from 'react-select'

const suggetions = countries.map(country => ({
  value: country.ISO3166_1_numeric,
  label: country.display_name
}))

const useStyles = makeStyles(theme => ({
  listItem: {
    color: 'inherit!important',
    textDecoration: 'none!important',
    height: 40,
    width: 'calc(100% - 16px)',
    borderRadius: '0 20px 20px 0',
    paddingLeft: 24,
    paddingRight: 12,
    '&.active': {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.secondary.contrastText + '!important',
      pointerEvents: 'none',
      '& .list-item-icon': {
        color: 'inherit'
      }
    },
    '& .list-item-icon': {
      fontSize: 16,
      width: 16,
      height: 16,
      marginRight: 16
    }
  },
}));

function ClubSidebarContent(props) {
  const dispatch = useDispatch();
  const labels = useSelector(({ clubApp }) => clubApp.labels);
  const folders = useSelector(({ clubApp }) => clubApp.folders);
  const filters = useSelector(({ clubApp }) => clubApp.filters);

  const classes = useStyles(props);
  const theme = useTheme()
  const selectStyles = {
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? theme.palette.action.active : theme.palette.secondary[200],
      background: theme.palette.secondary[200]
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: theme.palette.action.active
    })
    ,
    control: (provided, state) => ({
      ...provided,
      background: theme.palette.secondary[200]
    }),
  }
  


  return (
    <FuseAnimate animation="transition.slideUpIn" delay={400}>

      <div className="flex-auto border-l-1 border-solid">
        <div className="p-24">
          <Box id="select-box">
            <FormLabel component="legend" className="pb-3">Clubs</FormLabel>
            <Select
              options={suggetions}
              styles={selectStyles}
            />
          </Box>
          <Button
            onClick={() => {
              dispatch(Actions.openNewClubDialog());
            }}
            variant="contained"
            color="primary"
            className="w-full mt-2"
          >
            ADD CLUB / 클럽 추가
          </Button>
        </div>
        {/** 
        <div className={classes.listWrapper}>

          <List>
            {folders.length > 0 && folders.map((folder) => (
              <ListItem
                button
                component={NavLinkAdapter}
                to={'/apps/club/' + folder.handle} key={folder.id}
                activeClassName="active"
                className={classes.listItem}
              >
                <Icon className="list-item-icon" color="action">{folder.icon}</Icon>
                <ListItemText primary={folder.title} disableTypography={true} />
              </ListItem>
            ))}
          </List>

          <List>
            <ListSubheader className={classes.listSubheader} disableSticky>FILTERS</ListSubheader>

            {filters.length > 0 && filters.map((filter) => (
              <ListItem
                button
                component={NavLinkAdapter}
                to={'/apps/club/filter/' + filter.handle}
                activeClassName="active"
                className={classes.listItem}
                key={filter.id}
              >
                <Icon className="list-item-icon" color="action">{filter.icon}</Icon>
                <ListItemText primary={filter.title} disableTypography={true} />
              </ListItem>
            ))}
          </List>

          <List>

            <ListSubheader className="pr-24 pl-24" disableSticky>LABELS</ListSubheader>

            {labels.length > 0 && labels.map((label) => (
              <ListItem
                button
                component={NavLinkAdapter}
                to={'/apps/club/label/' + label.handle}
                key={label.id}
                className={classes.listItem}
              >
                <Icon className="list-item-icon" style={{ color: label.color }}
                  color="action">label</Icon>
                <ListItemText primary={label.title} disableTypography={true} />
              </ListItem>
            ))}
          </List>
        </div>
        */}
      </div>
    </FuseAnimate>
  );
}

export default ClubSidebarContent;