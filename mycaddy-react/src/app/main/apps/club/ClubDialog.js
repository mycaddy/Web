import React, { useCallback, useEffect, useState } from 'react';
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  Chip,
  Icon,
  IconButton,
  Typography,
  Toolbar,
  AppBar,
  Avatar,
  Checkbox,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@material-ui/core';
import amber from '@material-ui/core/colors/amber';
import red from '@material-ui/core/colors/red';
import { FuseUtils } from '@fuse';
import { useForm } from '@fuse/hooks';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment/moment';
import _ from '@lodash';
import * as Actions from './store/actions';

const defaultFormState = {
  'id': '',
  'title': '',
  'notes': '',
  'startDate': new Date(),
  'dueDate': new Date(),
  'completed': false,
  'starred': false,
  'important': false,
  'deleted': false,
  'labels': []
};

function ClubDialog(props) {
  const dispatch = useDispatch();
  const clubDialog = useSelector(({ clubApp }) => clubApp.clubs.clubDialog);
  const labels = useSelector(({ clubApp }) => clubApp.labels);

  const [labelMenuEl, setLabelMenuEl] = useState(null);
  const { form, handleChange, setForm } = useForm({ ...defaultFormState });
  const startDate = moment(form.startDate).format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);
  const dueDate = moment(form.dueDate).format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);

  const initDialog = useCallback(
    () => {
      /**
       * Dialog type: 'edit'
       */
      if (clubDialog.type === 'edit' && clubDialog.data) {
        setForm({ ...clubDialog.data });
      }

      /**
       * Dialog type: 'new'
       */
      if (clubDialog.type === 'new') {
        setForm({
          ...defaultFormState,
          ...clubDialog.data,
          id: FuseUtils.generateGUID()
        });
      }
    },
    [clubDialog.data, clubDialog.type, setForm]
  );

  useEffect(() => {
    /**
     * After Dialog Open
     */
    if (clubDialog.props.open) {
      initDialog();
    }

  }, [clubDialog.props.open, initDialog]);

  function closeClubDialog() {
    clubDialog.type === 'edit' ? dispatch(Actions.closeEditClubDialog()) : dispatch(Actions.closeNewClubDialog());
  }

  function handleLabelMenuOpen(event) {
    setLabelMenuEl(event.currentTarget);
  }

  function handleLabelMenuClose(event) {
    setLabelMenuEl(null);
  }

  function handleToggleImportant() {
    setForm({
      ...form,
      important: !form.important
    });
  }

  function handleToggleStarred() {
    setForm({
      ...form,
      starred: !form.starred
    });
  }

  function handleToggleLabel(event, id) {
    event.stopPropagation();
    setForm(
      _.set({
        ...form,
        labels: form.labels.includes(id) ? form.labels.filter(labelId => labelId !== id) : [...form.labels, id]
      })
    );
  }

  function toggleCompleted() {
    setForm({
      ...form,
      completed: !form.completed
    })
  }

  function canBeSubmitted() {
    return (
      form.title.length > 0
    );
  }


  return (
    <Dialog {...clubDialog.props} onClose={closeClubDialog} fullWidth maxWidth="sm">

      <AppBar position="static" elevation={1}>
        <Toolbar className="flex w-full">
          <Typography variant="subtitle1" color="inherit">
            {clubDialog.type === 'new' ? 'New Club' : 'Edit Club'}
          </Typography>
        </Toolbar>
      </AppBar>

      <DialogContent classes={{ root: "p-0" }}>

        <div className="mb-16">
          <div className="flex items-center justify-between p-12">

            <div className="flex">
              <Checkbox
                tabIndex={-1}
                checked={form.completed}
                onChange={toggleCompleted}
                onClick={(ev) => ev.stopPropagation()}
              />
            </div>

            <div className="flex items-center justify-start" aria-label="Toggle star">
              <IconButton onClick={handleToggleImportant}>
                {form.important ? (
                  <Icon style={{ color: red[500] }}>error</Icon>
                ) : (
                    <Icon>error_outline</Icon>
                  )}
              </IconButton>

              <IconButton onClick={handleToggleStarred}>
                {form.starred ? (
                  <Icon style={{ color: amber[500] }}>star</Icon>
                ) : (
                    <Icon>star_outline</Icon>
                  )}
              </IconButton>
              <div>
                <IconButton
                  aria-owns={labelMenuEl ? 'label-menu' : null}
                  aria-haspopup="true"
                  onClick={handleLabelMenuOpen}
                >
                  <Icon>label</Icon>
                </IconButton>
                <Menu
                  id="label-menu"
                  anchorEl={labelMenuEl}
                  open={Boolean(labelMenuEl)}
                  onClose={handleLabelMenuClose}
                >
                  {labels.length > 0 && labels.map((label) => (
                    <MenuItem onClick={(ev) => handleToggleLabel(ev, label.id)} key={label.id}>
                      <ListItemIcon className="min-w-40">
                        <Icon className="mr-0" color="action">
                          {form.labels.includes(label.id) ? 'check_box' : 'check_box_outline_blank'}
                        </Icon>
                      </ListItemIcon>
                      <ListItemText primary={label.title} disableTypography={true} />
                      <ListItemIcon className="min-w-40">
                        <Icon className="mr-0" style={{ color: label.color }} color="action">
                          label
                                                </Icon>
                      </ListItemIcon>
                    </MenuItem>
                  ))}
                </Menu>
              </div>
            </div>
          </div>
          <Divider className="mx-24" />
        </div>

        {form.labels.length > 0 && (
          <div className="flex flex-wrap  px-16 sm:px-24 mb-16">
            {form.labels.map(label => (
              <Chip
                avatar={(
                  <Avatar
                    classes={{ colorDefault: "bg-transparent" }}>
                    <Icon
                      className="text-20"
                      style={{ color: _.find(labels, { id: label }).color }}
                    >
                      label
                                        </Icon>
                  </Avatar>
                )}
                label={_.find(labels, { id: label }).title}
                onDelete={(ev) => handleToggleLabel(ev, label)}
                className="mr-8 my-8"
                classes={{ label: "pl-4" }}
                key={label}
              />
            ))}
          </div>
        )}

        <div className="px-16 sm:px-24">
          <FormControl className="mt-8 mb-16" required fullWidth>
            <TextField
              label="Title"
              autoFocus
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              variant="outlined"
            />
          </FormControl>

          <FormControl className="mt-8 mb-16" required fullWidth>
            <TextField
              label="Notes"
              name="notes"
              multiline
              rows="6"
              value={form.notes}
              onChange={handleChange}
              variant="outlined"
            />
          </FormControl>
          <div className="flex">
            <TextField
              name="startDate"
              label="Start Date"
              type="datetime-local"
              className="mt-8 mb-16 mr-8"
              InputLabelProps={{
                shrink: true
              }}
              inputProps={{
                max: dueDate
              }}
              value={startDate}
              onChange={handleChange}
              variant="outlined"
            />
            <TextField
              name="dueDate"
              label="Due Date"
              type="datetime-local"
              className="mt-8 mb-16 ml-8"
              InputLabelProps={{
                shrink: true
              }}
              inputProps={{
                min: startDate
              }}
              value={dueDate}
              onChange={handleChange}
              variant="outlined"
            />
          </div>
        </div>

      </DialogContent>

      {clubDialog.type === 'new' ? (
        <DialogActions className="justify-between pl-8 sm:pl-16">
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              dispatch(Actions.addClub(form));
              closeClubDialog();
            }}
            disabled={!canBeSubmitted()}
          >
            Add
                    </Button>
        </DialogActions>
      ) : (
          <DialogActions className="justify-between pl-8 sm:pl-16">
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                dispatch(Actions.updateClub(form));
                closeClubDialog();
              }}
              disabled={!canBeSubmitted()}
            >
              Save
                    </Button>
            <IconButton
              className="min-w-auto"
              onClick={() => {
                dispatch(Actions.removeClub(form.id));
                closeClubDialog();
              }}
            >
              <Icon>delete</Icon>
            </IconButton>
          </DialogActions>
        )}
    </Dialog>
  );
}

export default ClubDialog;
