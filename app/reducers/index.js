import {combineReducers} from 'redux';

import user from './user';
import vendors from './vendors';
import vendorTags from './vendorTags';
import productSeals from './productSeals';
import productionSeals from './productionSeals';
import vendorSelected from './vendorSelected';
import products from './products';

const rootReducer = combineReducers({user, vendors, vendorTags,
     products, productSeals, productionSeals, vendorSelected });

export default rootReducer;
