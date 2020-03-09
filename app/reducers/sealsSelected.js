import {
    SEALSSELECTED,
  } from '../actions';
  
  const initialState = []
  
  export default function sealsSelected(state=initialState, action) {

    switch (action.type) {
      case SEALSSELECTED:
        return action.sealsSelected;
  
      default:
        return state;
    }
  }