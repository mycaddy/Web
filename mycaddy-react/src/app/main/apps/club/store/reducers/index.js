import {combineReducers} from 'redux';
import clubs from './clubs.reducer';
import folders from './folders.reducer';
import labels from './labels.reducer';
import filters from './filters.reducer';

import contacts from './contacts.reducer';
import user from './user.reducer';

const reducer = combineReducers({
    clubs,
    folders,
    labels,
    filters,
    contacts,
    user,
});

export default reducer;
