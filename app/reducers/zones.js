import {
    ZONES, CLEANZONES
  } from '../actions';
  
  const initialState = []
  
  export default function zones(state=initialState, action) {
      
    switch (action.type) {
      case ZONES:
        return action.zoneStack;
      
      case CLEANZONES:
        return initialState;

      default:
        return state;
    }
  }