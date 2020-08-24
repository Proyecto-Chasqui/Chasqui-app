import {
    PRODUCERS
  } from '../actions';
  
  const initialState = []
  
  export default function producers(state=initialState, action) {
      
    switch (action.type) {
      case PRODUCERS:
        return action.producersStack;
  
      default:
        return state;
    }
  }