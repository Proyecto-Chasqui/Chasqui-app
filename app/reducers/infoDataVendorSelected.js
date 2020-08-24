import {
    INFODATAVENDORSELECTED, INFODATAVENDORUNSELECTED
  } from '../actions';
  
  const initialState = {
    
  }
  
  export default function infoDataVendorSelected(state=initialState, action) {

    switch (action.type) {
      case INFODATAVENDORSELECTED:
        return action.dataVendorSelected;

      case INFODATAVENDORUNSELECTED:
        return initialState;

      default:
        return state;
    }
  }