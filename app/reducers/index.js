import {combineReducers} from 'redux';

import resetState from './resetState';
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
import shoppingCartSelected from './shoppingCartSelected';
import shoppingCarts from './shoppingCarts';
import allProducts from './allProducts';

const rootReducer = combineReducers({resetState, user, vendors, vendorTags,
     products, seals, sealsSelected, vendorSelected, productSelected, producers,
     producerSelected, productSeals, productionSeals, productCategories, zones, sellerPoints,
     personalData, adressesData, shoppingCartSelected, shoppingCarts, allProducts });

export default rootReducer;
