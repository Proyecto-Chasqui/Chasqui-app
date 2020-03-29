import {
    ADRESSESDATA
  } from '../actions';
  
  const initialState = []
  
  export default function adressesData(state=initialState, action) {
      
    switch (action.type) {
      case ADRESSESDATA:
        console.log("action", action);
        return action.adressesData;

      default:
        return state;
    }
  }