import {
    MEMBERSELECTED,
  } from '../actions';
  const initialState = [];
  
  export default function memberSelected(state=initialState, action) {
      
    switch (action.type) {
      case MEMBERSELECTED:
        return action.memberData;
        
      default:
        return state;
    }
  }