import * as Actions from '../actions'

const initialState = {
  searchText: '',
  countryDialog: {
    type: 'new',
    props: {
      open: false
    },
    data: null
  }
}

const countriesReducer = function (state = initialState, action) {
  switch(action.type) {
    case Actions.SET_COUNTRY_SEARCH_TEXT:
      {
        return {
          ...state,
          searchText: action.searchText
        }
      }
    case Actions.OPEN_NEW_COUNTRY_DIALOG: 
      {
        return {
          ...state,
          countryDialog: {
            type: 'new',
            props: {
              open: true
            },
            data: null
          }
        }
      }
    case Actions.CLOSE_NEW_COUNTRY_DIALOG: 
      {
        return {
          ...state,
          countryDialog: {
            type: 'new',
            props: {
              open: false
            },
            data: null
          }
        }
      }
    case Actions.OPEN_EDIT_COUNTRY_DIALOG:
      {
        return {
          ...state,
          countryDialog: {
            type: 'edit',
            props: {
              open: true
            },
            data: action.data 
          }
        }
      }
    case Actions.CLOSE_EDIT_COUNTRY_DIALOG:
      {
        return {
          ...state,
          countryDialog: {
            type: 'edit',
            props: {
              open: false
            },
            data: null
          }
        }
      }
    default:
      {
        return state
      }
  }
}

export default countriesReducer
