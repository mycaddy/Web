import React from 'react';
import { IconButton, Icon, Typography, Checkbox, ListItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import red from '@material-ui/core/colors/red';
import amber from '@material-ui/core/colors/amber';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import _ from '@lodash';
import * as Actions from './store/actions';
import ClubChip from './ClubChip';

const useStyles = makeStyles({
  clubItem: {
    '&.completed': {
      background: 'rgba(0,0,0,0.03)',
      '& .club-title, & .club-notes': {
        textDecoration: 'line-through'
      }
    }
  }
});

function ClubListItem(props) {
  const dispatch = useDispatch();
  const labels = useSelector(({ clubApp }) => clubApp.labels);

  const classes = useStyles(props);

  return (
    <ListItem
      className={clsx(classes.clubItem, { "completed": props.club.completed }, "border-solid border-b-1 py-16  px-0 sm:px-8")}
      onClick={(ev) => {
        ev.preventDefault();
        dispatch(Actions.openEditClubDialog(props.club));
      }}
      dense
      button
    >
      <Checkbox
        tabIndex={-1}
        disableRipple
        checked={props.club.completed}
        onChange={() => dispatch(Actions.toggleCompleted(props.club))}
        onClick={(ev) => ev.stopPropagation()}
      />

      <div className="flex flex-1 flex-col relative overflow-hidden pl-8">

        <Typography
          variant="subtitle1"
          className="club-title truncate"
          color={props.club.completed ? "textSecondary" : "inherit"}
        >
          {props.club.title}
        </Typography>

        <Typography
          color="textSecondary"
          className="club-notes truncate"
        >
          {_.truncate(props.club.notes.replace(/<(?:.|\n)*?>/gm, ''), { 'length': 180 })}
        </Typography>

        <div className={clsx(classes.labels, "flex mt-8")}>
          {props.club.labels.map(label => (
            <ClubChip
              className="mr-4"
              title={_.find(labels, { id: label }).title}
              color={_.find(labels, { id: label }).color}
              key={label}
            />
          ))}
        </div>
      </div>

      <div className="px-8">
        <IconButton onClick={(ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          dispatch(Actions.toggleImportant(props.club))
        }}>
          {props.club.important ? (
            <Icon style={{ color: red[500] }}>error</Icon>
          ) : (
              <Icon>error_outline</Icon>
            )}
        </IconButton>
        <IconButton onClick={(ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          dispatch(Actions.toggleStarred(props.club))
        }}>
          {props.club.starred ? (
            <Icon style={{ color: amber[500] }}>star</Icon>
          ) : (
              <Icon>star_outline</Icon>
            )}
        </IconButton>
      </div>
    </ListItem>
  );
}

export default ClubListItem;
