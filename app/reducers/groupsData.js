import {
    GROUPSDATA,
  } from '../actions';
  const initialState = [];
  
  export default function groupsData(state=initialState, action) {
      
    switch (action.type) {
      case GROUPSDATA:
        return action.groupsStack;
        
      default:
        return state;
    }
  }