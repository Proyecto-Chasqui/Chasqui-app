import {
    INVITATIONS,
  } from '../actions';
  const initialState = [];
  
  export default function invitationsData(state=initialState, action) {
      
    switch (action.type) {
      case INVITATIONS:
        return action.invitationsStack;
        
      default:
        return state;
    }
  }