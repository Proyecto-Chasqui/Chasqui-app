import {
    PRODUCTSEALS,
  } from '../actions';
  
  const initialState = []
  
  export default function productSeals(state=initialState, action) {
      
    switch (action.type) {
      case PRODUCTSEALS:
        return action.productSealsStack;
  
      default:
        return state;
    }
  }