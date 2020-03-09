import {combineReducers} from 'redux';

import user from './user';
import vendors from './vendors';
import vendorTags from './vendorTags';
import productSeals from './productSeals';
import productionSeals from './productionSeals';
import vendorSelected from './vendorSelected';
import products from './products';
import productSelected from './productSelected';

const rootReducer = combineReducers({user, vendors, vendorTags,
     products, productSeals, productionSeals, vendorSelected, productSelected });

export default rootReducer;
