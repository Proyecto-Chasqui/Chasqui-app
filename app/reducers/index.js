import {combineReducers} from 'redux';

import user from './user';
import vendors from './vendors';
import vendorTags from './vendorTags';

const rootReducer = combineReducers({user, vendors, vendorTags});

export default rootReducer;
