import {
    UNREADNOTIFICATIONS
  } from '../actions';
  
  const initialState = []
  
  export default function unreadNotifications(state=initialState, action) {
      
    switch (action.type) {
      case UNREADNOTIFICATIONS:
        return action.unreadNotificationsData;

      default:
        return state;
    }
  }