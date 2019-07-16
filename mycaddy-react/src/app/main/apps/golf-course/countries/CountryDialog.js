import React, { useEffect, useCallback, useState } from 'react'
import {
  TextField, Button, Dialog, DialogActions, DialogContent,
  Icon, IconButton, Typography, Toolbar, AppBar, Avatar
} from '@material-ui/core'
import { useForm } from '@fuse/hooks';
import FuseUtils from '@fuse/FuseUtils';
import * as Actions from './store/actions';
import { useDispatch, useSelector } from 'react-redux';

import { useApolloClient, useMutation } from "react-apollo-hooks";
import { GET_COUNTRY_NUMBER_IDS } from '../../../../apollo/queries'
import { CREATE_COUNTRY, UPDATE_COUNTRY, DELETE_COUNTRY } from '../../../../apollo/mutations'
import _ from '@lodash'

const defaultCountryInput = {
  id_number: '',
  iso_numeric: '',
  iso_alpha_2: '',
  iso_alpha_3: '',
  name_en: '',
  name_kr: '',
}

const defaultFormState = {
  flag: 'assets/images/countries/_flag.none.0.svg',
  id: '',
  id_number: '',
  ...defaultCountryInput
};

function CountryDialog(props) {
  const dispatch = useDispatch();
  const countryDialog = useSelector(({ countriesApp }) => countriesApp.countries.countryDialog)
  const { form, handleChange, setForm } = useForm(defaultFormState)
  const client = useApolloClient()
  // const updateCountryStore = useMutation(UPDATE_COUNTRY)

  const initDialog = useCallback(
    async () => {
      // console.log('useCallback')
      if (countryDialog.type === 'edit' && countryDialog.data) {
        setForm({
          ...countryDialog.data,
          flag: `assets/images/countries/${countryDialog.data.name_en.toLowerCase().replace(/ /gi, '-')}.svg`
        });
      }

      if (countryDialog.type === 'new') {

        const { data } = await client.query({
          query: GET_COUNTRY_NUMBER_IDS,
          variables: { orderBy: 'id_number_ASC' },
          fetchPolicy: 'network-only',
        });
        const ids = data.countries.data.map(a => a.id_number)
        const id_number_suggestion = FuseUtils.getSerialNumber(ids)

        setForm({
          ...defaultFormState,
          id_number: id_number_suggestion
          //id: FuseUtils.generateGUID()
        });
      }
    },
    [countryDialog.data, countryDialog.type, setForm],
  )

  useEffect(() => {
    // console.log('useEffect,countryDialog', 'countryDialog')
    if (countryDialog.props.open) {
      initDialog();
    }

  }, [countryDialog.props.open, initDialog]);

  function closeComposeDialog() {
    countryDialog.type === 'edit' ? dispatch(Actions.closeEditCountryDialog()) : dispatch(Actions.closeNewCountryDialog());
  }

  function canBeSubmitted() {
    return (
      form.name_en.length > 0
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    // clear form data for GQL CountryInputType
    let country_data = _.pick(form, _.keys(defaultCountryInput))
    country_data = _.pickBy(country_data, _.identity)
    if (form.iso_numeric)
      _.set(country_data, 'iso_numeric', form.iso_numeric.toString())
    console.log('country_data', country_data)

    if (countryDialog.type === 'new') {
      const { data } = await client.mutate({
        mutation: CREATE_COUNTRY,
        variables: {
          data: country_data
        }
      })

    }
    else {
      console.log('edit', form.id)
      const { data } = await client.mutate({
        mutation: UPDATE_COUNTRY,
        variables: {
          id: form.id,
          data: country_data
        },
      })
      console.log('mutate result', data)

    }
    closeComposeDialog();
  }

  async function handleRemove() {
    // dispatch(Actions.removeCountry(form.id));
    console.log(form)
    const { data } = await client.mutate({
      mutation: DELETE_COUNTRY,
      variables: { id: form.id }
    })
    console.log('deleted', data)
    closeComposeDialog();
  }

  return (
    <Dialog
      classes={{
        paper: "m-24"
      }}
      {...countryDialog.props}
      onClose={closeComposeDialog}
      fullWidth
      maxWidth="xs"
    >

      <AppBar position="static" elevation={1}>
        <Toolbar className="flex w-full">
          <Typography variant="subtitle1" color="inherit">
            {countryDialog.type === 'new' ? 'New Country' : 'Edit Country'}
          </Typography>
        </Toolbar>
        <div className="flex flex-col items-center justify-center pb-24">
          <Avatar className="w-60 h-60" alt="contact avatar" src={form.flag} />
          {countryDialog.type === 'edit' && (
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
              <Icon color="action">bookmark</Icon>
            </div>
            <TextField
              className="mb-24"
              label="ID (Numeric)"
              autoFocus
              id="id_number"
              name="id_number"
              value={form.id_number ? form.id_number : ''}
              onChange={handleChange}
              variant="outlined"
              required
              fullWidth
            />
          </div>

          <div className="flex">
            <div className="min-w-48 pt-20">
              <Icon color="action">book</Icon>
            </div>
            <TextField
              className="mb-24"
              label="Name (English)"
              autoFocus
              id="name_en"
              name="name_en"
              value={form.name_en ? form.name_en : ''}
              onChange={handleChange}
              variant="outlined"
              required
              fullWidth
            />
          </div>

          <div className="flex">
            <div className="min-w-48 pt-20">
              <Icon color="action">book</Icon>
            </div>
            <TextField
              className="mb-24"
              label="Name (Korean)"
              id="name_kr"
              name="name_kr"
              value={form.name_kr ? form.name_kr : ''}
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
              label="2 Code"
              id="iso_alpha_2"
              name="iso_alpha_2"
              value={form.iso_alpha_2 ? form.iso_alpha_2 : ''}
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
              value={form.iso_alpha_3 ? form.iso_alpha_3 : ''}
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
              value={form.iso_numeric ? form.iso_numeric : ''}
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
              value={form.dial_number ? form.dial_number : ''}
              onChange={handleChange}
              variant="outlined"
              fullWidth
            />
          </div>


        </DialogContent>

        {countryDialog.type === 'new' ? (
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
