import {
    LOGIN,
    LOGOUT,
    SETPASSWORD
  } from '../actions';
  
  const initialState = {
    email: "",
    token: "",
    id: 0,
    nickname: "usuario no logueado",
    avatar: "",
  }
  
  export default function user(state=initialState, action) {
      
    switch (action.type) {
      case LOGIN:
        return action.userData;
  
      case LOGOUT:
        return initialState;

      case SETPASSWORD:
        return Object.assign({}, state, {
          password: action.passwordData
        });
  
      default:
        return state;
    }
  }
  