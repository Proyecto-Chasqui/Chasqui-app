import {
    HASRECEIVEDEXPIREDCARTNOTIFICATION
  } from '../actions';
  
  const initialState = false
  
  export default function hasReceivedExpiredCartNotification(state=initialState, action) {
    
    switch (action.type) {
  
      case HASRECEIVEDEXPIREDCARTNOTIFICATION:   
        return action.hasReceivedExpiredCartNotificationValue;
  
      default:
        return state;
    }
  }