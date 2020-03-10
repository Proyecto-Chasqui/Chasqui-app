import {combineReducers} from 'redux';

import user from './user';
import vendors from './vendors';
import vendorTags from './vendorTags';
import seals from './seals';
import sealsSelected from './sealsSelected';
import productSeals from './productSeals'
import productionSeals from './productionSeals';
import vendorSelected from './vendorSelected';
import products from './products';
import productSelected from './productSelected';
import producers from './producers';
import producerSelected from './producerSelected';
import productCategories from './productCategories';

const rootReducer = combineReducers({user, vendors, vendorTags,
     products, seals, sealsSelected, vendorSelected, productSelected, producers,
     producerSelected, productSeals, productionSeals, productCategories });

export default rootReducer;
