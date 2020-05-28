import {
    SELECTEDNODEREQUESTS
  } from '../actions';
  
  const initialState = []
  
  export default function selectedNodeRequests(state=initialState, action) {
      
    switch (action.type) {
      case SELECTEDNODEREQUESTS:
        return action.selectedNodeRequestsStack;

      default:
        return state;
    }
  }