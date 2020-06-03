import {
    HASRECEIVEDPUSHNOTIFICATIONS
  } from '../actions';
  
  const initialState = false
  
  export default function hasReceivedPushNotifications(state=initialState, action) {
    
    switch (action.type) {
  
      case HASRECEIVEDPUSHNOTIFICATIONS:   
        return action.hasReceivedPushNotificationsValue;
  
      default:
        return state;
    }
  }