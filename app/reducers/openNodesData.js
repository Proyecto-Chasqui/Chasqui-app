import {
    OPENNODESDATA,
  } from '../actions';
  const initialState = [];
  
  export default function openNodesData(state=initialState, action) {
      
    switch (action.type) {
      case OPENNODESDATA:
        return action.openNodesStack;
        
      default:
        return state;
    }
  }