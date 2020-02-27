import {combineReducers} from 'redux';

import user from './user';
import vendors from './vendors';

const rootReducer = combineReducers({user, vendors});

export default rootReducer;
