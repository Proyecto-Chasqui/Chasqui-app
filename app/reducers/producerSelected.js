import {
    PRODUCERSELECTED,
  } from '../actions';
  
  const initialState = {}
  
  export default function producerSelected(state=initialState, action) {
    
    switch (action.type) {
      case PRODUCERSELECTED:
        return action.producer;
  
      default:
        return state;
    }
  }