import React, { useEffect, useCallback } from 'react';
import { TextField, Button, Dialog, DialogActions, DialogContent, Icon, IconButton, Typography, Toolbar, AppBar, Avatar } from '@material-ui/core';
import { useForm } from '@fuse/hooks';
import FuseUtils from '@fuse/FuseUtils';
import * as Actions from './store/actions';
import { useDispatch, useSelector } from 'react-redux';

const defaultFormState = {
  flag: 'assets/images/countries/_flag.none.0.svg',
  id: '',
  id_number: '',
  name_en: '',
  name_kr: '',
  iso_numeric: '',
  iso_alpha_2: '',
  iso_alpha_3: '',
  dial_number: ''
};

function CountryDialog(props) {
  const dispatch = useDispatch();
  const contactDialog = useSelector(({ countriesApp }) => countriesApp.countries.countryDialog)
  console.log('contactDialog', contactDialog)
  const { form, handleChange, setForm } = useForm(defaultFormState)
   
  const initDialog = useCallback(
    () => {
      if (contactDialog.type === 'edit' && contactDialog.data) {
        setForm({ ...contactDialog.data, flag: `assets/images/countries/${contactDialog.data.name_en.toLowerCase().replace(/ /gi, '-')}.svg` });
      }

      if (contactDialog.type === 'new') {
        setForm({
          ...defaultFormState,
          ...contactDialog.data,
          id: FuseUtils.generateGUID()
        });
      }
    },
    [contactDialog.data, contactDialog.type, setForm],
  )
  
  useEffect(() => {
    if (contactDialog.props.open) {
      initDialog();
    }

  }, [contactDialog.props.open, initDialog]);
   
  function closeComposeDialog() {
    contactDialog.type === 'edit' ? dispatch(Actions.closeEditCountryDialog()) : dispatch(Actions.closeNewCountryDialog());
  }

  function canBeSubmitted() {
    return (
      form.name_en.length > 0
    );
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (contactDialog.type === 'new') {
      // dispatch(Actions.addCountry(form));
    }
    else {
      // dispatch(Actions.updateCountry(form));
    }
    closeComposeDialog();
  }

  function handleRemove() {
    // dispatch(Actions.removeCountry(form.id));
    closeComposeDialog();
  }

  return (
    <Dialog
      classes={{
        paper: "m-24"
      }}
      {...contactDialog.props}
      onClose={closeComposeDialog}
      fullWidth
      maxWidth="xs"
    >

      <AppBar position="static" elevation={1}>
        <Toolbar className="flex w-full">
          <Typography variant="subtitle1" color="inherit">
            {contactDialog.type === 'new' ? 'New Country' : 'Edit Country'}
          </Typography>
        </Toolbar>
        <div className="flex flex-col items-center justify-center pb-24">
          <Avatar className="w-60 h-60" alt="contact avatar" src={form.flag} />
          {contactDialog.type === 'edit' && (
            <Typography variant="h6" color="inherit" className="pt-8">
              {form.name_en}
            </Typography>
          )}
        </div>
      </AppBar>
      <form noValidate onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
        <DialogContent classes={{ root: "p-24" }}>
          <div className="flex">
            <div className="min-w-48 pt-20">
              <Icon color="action">account_circle</Icon>
            </div>
            <TextField
              className="mb-24"
              label="ID (Numeric)"
              autoFocus
              id="id_number"
              name="id_number"
              value={form.id_number}
              onChange={handleChange}
              variant="outlined"
              required
              fullWidth
            />
          </div>

          <div className="flex">
            <div className="min-w-48 pt-20">
              <Icon color="action">account_circle</Icon>
            </div>
            <TextField
              className="mb-24"
              label="Name (English)"
              autoFocus
              id="name_en"
              name="name_en"
              value={form.name_en}
              onChange={handleChange}
              variant="outlined"
              required
              fullWidth
            />
          </div>

          <div className="flex">
            <div className="min-w-48 pt-20">
            </div>
            <TextField
              className="mb-24"
              label="Name (Korean)"
              id="name_kr"
              name="name_kr"
              value={form.name_kr}
              onChange={handleChange}
              variant="outlined"
              fullWidth
            />
          </div>

          <div className="flex">
            <div className="min-w-48 pt-20">
              <Icon color="action">star</Icon>
            </div>
            <TextField
              className="mb-24"
              label="2 Code"
              id="iso_alpha_2"
              name="iso_alpha_2"
              value={form.iso_alpha_2}
              onChange={handleChange}
              variant="outlined"
              fullWidth
            />
          </div>

          <div className="flex">
            <div className="min-w-48 pt-20">
              <Icon color="action">domain</Icon>
            </div>
            <TextField
              className="mb-24"
              label="3 Code"
              id="iso_alpha_3"
              name="iso_alpha_3"
              value={form.iso_alpha_3}
              onChange={handleChange}
              variant="outlined"
              fullWidth
            />
          </div>

          <div className="flex">
            <div className="min-w-48 pt-20">
              <Icon color="action">domain</Icon>
            </div>
            <TextField
              className="mb-24"
              label="Numeric Code"
              id="iso_numeric"
              name="iso_numeric"
              value={form.iso_numeric}
              onChange={handleChange}
              variant="outlined"
              fullWidth
            />
          </div>

          <div className="flex">
            <div className="min-w-48 pt-20">
              <Icon color="action">phone</Icon>
            </div>
            <TextField
              className="mb-24"
              label="Dial"
              id="dial_number"
              name="dial_number"
              value={form.dial_number}
              onChange={handleChange}
              variant="outlined"
              fullWidth
            />
          </div>

          <div className="flex">
            <div className="min-w-48 pt-20">
              <Icon color="action">work</Icon>
            </div>
            <TextField
              className="mb-24"
              label="Job title"
              id="jobTitle"
              name="jobTitle"
              value={form.jobTitle}
              onChange={handleChange}
              variant="outlined"
              fullWidth
            />
          </div>

          <div className="flex">
            <div className="min-w-48 pt-20">
              <Icon color="action">cake</Icon>
            </div>
            <TextField
              className="mb-24"
              id="birthday"
              label="Birthday"
              type="date"
              value={form.birthday}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true
              }}
              variant="outlined"
              fullWidth
            />
          </div>

        </DialogContent>

        {contactDialog.type === 'new' ? (
          <DialogActions className="justify-between pl-16">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              type="submit"
              disabled={!canBeSubmitted()}
            >
              Add
                        </Button>
          </DialogActions>
        ) : (
            <DialogActions className="justify-between pl-16">
              <Button
                variant="contained"
                color="primary"
                type="submit"
                onClick={handleSubmit}
                disabled={!canBeSubmitted()}
              >
                Save
                        </Button>
              <IconButton
                onClick={handleRemove}
              >
                <Icon>delete</Icon>
              </IconButton>
            </DialogActions>
          )}
      </form>
    </Dialog>
  );
}

export default CountryDialog;
