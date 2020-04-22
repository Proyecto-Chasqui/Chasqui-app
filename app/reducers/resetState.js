import {
    RESETSTATE
  } from '../actions';
  
  const initialState = {
                         reset: false,
                        }
  
  export default function resetState(state=initialState, action) {
      
    switch (action.type) {
      case RESETSTATE:
        return action.resetDataState;

      default:
        return state;
    }
  }