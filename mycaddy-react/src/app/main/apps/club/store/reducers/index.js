import {combineReducers} from 'redux';
import clubs from './clubs.reducer';
import folders from './folders.reducer';
import labels from './labels.reducer';
import filters from './filters.reducer';

const reducer = combineReducers({
    clubs,
    folders,
    labels,
    filters
});

export default reducer;
