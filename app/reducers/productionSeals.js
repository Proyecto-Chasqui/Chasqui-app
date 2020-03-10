import {
    PRODUCTIONSEALS,
  } from '../actions';
  
  const initialState = []
  
  export default function productionSeals(state=initialState, action) {
      
    switch (action.type) {
      case PRODUCTIONSEALS:
        return action.productionSealsStack;
  
      default:
        return state;
    }
  }