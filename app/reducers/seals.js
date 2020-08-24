import {
    SEALS,
  } from '../actions';
  
  const initialState = []
  
  export default function seals(state=initialState, action) {

    switch (action.type) {
      case SEALS:
        return action.sealsStack;
  
      default:
        return state;
    }
  }