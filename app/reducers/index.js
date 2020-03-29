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
import zones from './zones';
import sellerPoints from './sellerPoints';
import personalData from './personalData';
import adressesData from './adressesData';

const rootReducer = combineReducers({user, vendors, vendorTags,
     products, seals, sealsSelected, vendorSelected, productSelected, producers,
     producerSelected, productSeals, productionSeals, productCategories, zones, sellerPoints,
     personalData, adressesData });

export default rootReducer;
