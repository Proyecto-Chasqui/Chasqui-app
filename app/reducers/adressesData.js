import {
    ADRESSESDATA
  } from '../actions';
  
  const initialState = []
  
  export default function adressesData(state=initialState, action) {
      
    switch (action.type) {
      case ADRESSESDATA:
        return action.adressesData;

      default:
        return state;
    }
  }