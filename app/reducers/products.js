import {
    PRODUCTS,
  } from '../actions';
  
  const initialState = {

  }
  
  export default function products(state=initialState, action) {
      
    switch (action.type) {
      case PRODUCTS:
        return action.productStack;
  
      default:
        return state;
    }
  }