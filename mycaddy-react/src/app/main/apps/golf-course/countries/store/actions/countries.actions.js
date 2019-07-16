export const OPEN_EDIT_COUNTRY_DIALOG = '[GOLF-COURCE APP] OPEN EDIT COUNTRY DIALOG'
export const CLOSE_EDIT_COUNTRY_DIALOG = '[GOLF-COURCE APP] CLOSE EDIT COUNTRY DIALOG'
export const OPEN_NEW_COUNTRY_DIALOG = '[GOLF-COURCE APP] OPEN NEW COUNTRY DIALOG'
export const CLOSE_NEW_COUNTRY_DIALOG = '[GOLF-COURCE APP] CLOSE NEW COUNTRY DIALOG'
export const SET_COUNTRY_SEARCH_TEXT = '[GOLF-COURCE APP] SET COUNTRY SEARCH TEXT'

export function openEditCountryDialog(data) {
  return {
    type: OPEN_EDIT_COUNTRY_DIALOG,
    data
  }
}
export function closeEditCountryDialog() {
  return {
    type: CLOSE_EDIT_COUNTRY_DIALOG
  }
}
export function openNewCountryDialog() {
  return {
    type: OPEN_NEW_COUNTRY_DIALOG,
  }
}
export function closeNewCountryDialog() {
  return {
    type: CLOSE_NEW_COUNTRY_DIALOG
  }
}
export function setCountrySearchText(event) {
  return {
    type: SET_COUNTRY_SEARCH_TEXT,
    searchText: event.target.value
  }
}
