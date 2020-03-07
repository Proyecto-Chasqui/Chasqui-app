import {
    VENDORSELECTED, VENDORUNSELECTED
  } from '../actions';
  
  const initialState = {
    
  }
  
  export default function vendorSelected(state=initialState, action) {

    switch (action.type) {
      case VENDORSELECTED:
        return action.vendorSelectedData;

      case VENDORUNSELECTED:
        return initialState;

      default:
        return state;
    }
  }