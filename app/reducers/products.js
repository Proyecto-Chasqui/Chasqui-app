import {
    PRODUCTS, FLUSHPRODUCTS,
  } from '../actions';
  
  const initialState = [];
  
  export default function products(state=initialState, action) {
      
    switch (action.type) {
      case PRODUCTS:
        return action.productStack;
      
      case FLUSHPRODUCTS:
        return initialState;
        
      default:
        return state;
    }
  }