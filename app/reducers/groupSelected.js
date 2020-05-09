import {
    GROUPSELECTED,
  } from '../actions';
  const initialState = [];
  
  export default function groupsSelected(state=initialState, action) {
      
    switch (action.type) {
      case GROUPSELECTED:
        return action.groupSelectedData;
        
      default:
        return state;
    }
  }