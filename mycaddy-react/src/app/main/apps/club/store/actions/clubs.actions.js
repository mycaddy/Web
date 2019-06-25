import axios from 'axios';

export const GET_CLUBS = '[CLUB APP] GET CLUBS';
export const UPDATE_CLUBS = '[CLUB APP] UPDATE CLUBS';
export const TOGGLE_STARRED = '[CLUB APP] TOGGLE STARRED';
export const TOGGLE_COMPLETED = '[CLUB APP] TOGGLE COMPLETED';
export const TOGGLE_IMPORTANT = '[CLUB APP] TOGGLE IMPORTANT';
export const UPDATE_CLUB = '[CLUB APP] UPDATE CLUB';
export const ADD_CLUB = '[CLUB APP] ADD CLUB';
export const REMOVE_CLUB = '[CLUB APP] REMOVE CLUB';
export const SET_SEARCH_TEXT = '[CLUB APP] SET SEARCH TEXT';
export const OPEN_NEW_CLUB_DIALOG = '[CLUB APP] OPEN NEW CLUB DIALOG';
export const CLOSE_NEW_CLUB_DIALOG = '[CLUB APP] CLOSE NEW CLUB DIALOG';
export const OPEN_EDIT_CLUB_DIALOG = '[CLUB APP] OPEN EDIT CLUB DIALOG';
export const CLOSE_EDIT_CLUB_DIALOG = '[CLUB APP] CLOSE EDIT CLUB DIALOG';
export const TOGGLE_ORDER_DESCENDING = '[CLUB APP] TOGGLE ORDER DESCENDING';
export const CHANGE_ORDER = '[CLUB APP] CHANGE ORDER';

export function getClubs(params) {
  const request = axios.get('/api/club-app/clubs', { params });

  return (dispatch) =>
    request.then((response) =>
      dispatch({
        type: GET_CLUBS,
        routeParams: params,
        payload: response.data
      })
    );
}

export function updateClubs() {
  return (dispatch, getState) => {

    const { routeParams } = getState().clubApp.clubs;

    const request = axios.get('/api/club-app/clubs', {
      params: routeParams
    });

    return request.then((response) =>
      dispatch({
        type: UPDATE_CLUBS,
        payload: response.data
      })
    );
  }
}

export function toggleCompleted(club) {
  const newClub = {
    ...club,
    completed: !club.completed
  };
  return (dispatch) => (
    Promise.all([
      dispatch({ type: TOGGLE_COMPLETED })
    ]).then(() => dispatch(updateClub(newClub)))
  )
}

export function toggleStarred(club) {
  const newClub = {
    ...club,
    starred: !club.starred
  };
  return (dispatch) => (
    Promise.all([
      dispatch({ type: TOGGLE_STARRED })
    ]).then(() => dispatch(updateClub(newClub)))
  )
}

export function toggleImportant(club) {
  const newClub = {
    ...club,
    important: !club.important
  };

  return (dispatch) => (
    Promise.all([
      dispatch({ type: TOGGLE_IMPORTANT })
    ]).then(() => dispatch(updateClub(newClub)))
  )
}

export function updateClub(club) {
  const request = axios.post('/api/club-app/update-club', club);

  return (dispatch) =>
    request.then((response) => {
      Promise.all([
        dispatch({
          type: UPDATE_CLUB,
          payload: response.data
        })
      ]).then(() => dispatch(updateClubs()))
    }
    );
}

export function openNewClubDialog() {
  return {
    type: OPEN_NEW_CLUB_DIALOG
  }
}

export function closeNewClubDialog() {
  return {
    type: CLOSE_NEW_CLUB_DIALOG
  }
}

export function openEditClubDialog(data) {
  return {
    type: OPEN_EDIT_CLUB_DIALOG,
    data
  }
}

export function closeEditClubDialog() {
  return {
    type: CLOSE_EDIT_CLUB_DIALOG
  }
}

export function addClub(club) {
  const request = axios.post('/api/club-app/new-club', club);

  return (dispatch) =>
    request.then((response) => (
      Promise.all([
        dispatch({
          type: ADD_CLUB
        })
      ]).then(() => dispatch(updateClubs()))
    )
    );
}

export function removeClub(clubId) {
  const request = axios.post('/api/club-app/remove-club', clubId);

  return (dispatch) =>
    request.then((response) => (
      Promise.all([
        dispatch({
          type: REMOVE_CLUB
        })
      ]).then(() => dispatch(updateClubs()))
    )
    );
}

export function setSearchText(event) {
  return {
    type: SET_SEARCH_TEXT,
    searchText: event.target.value.toLowerCase()
  }
}

export function toggleOrderDescending() {
  return {
    type: TOGGLE_ORDER_DESCENDING
  }
}

export function changeOrder(orderBy) {
  return {
    type: CHANGE_ORDER,
    orderBy
  }
}
