import { combineReducers } from "redux"
import countries from "./countries.reducer";

const reducer = combineReducers({
  countries,
})

export default reducer