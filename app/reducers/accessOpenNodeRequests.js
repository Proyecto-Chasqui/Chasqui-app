import {
    ACCESSOPENNODEREQUESTS
  } from '../actions';
  
  const initialState = []
  
  export default function accessOpenNodeRequests(state=initialState, action) {
      
    switch (action.type) {
      case ACCESSOPENNODEREQUESTS:
        return action.accessOpenNodeRequestsStack;

      default:
        return state;
    }
  }