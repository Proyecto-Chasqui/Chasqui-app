import {combineReducers} from 'redux';

import user from './user';
import vendors from './vendors';
import vendorTags from './vendorTags';
import productSeals from './productSeals';
import productionSeals from './productionSeals';

const rootReducer = combineReducers({user, vendors, vendorTags, productSeals, productionSeals });

export default rootReducer;
