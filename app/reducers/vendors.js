import {
    VENDORS, OBTAINVENDORS
  } from '../actions';
  
  const initialState = {
    
  }
  
  export default function vendors(state=initialState, action) {
      
    switch (action.type) {
      case VENDORS:
        return action.stackVendors;
      
      case OBTAINVENDORS:
        return state;

      default:
        return state;
    }
  }