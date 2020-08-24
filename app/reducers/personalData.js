import {
    PERSONALDATA
  } from '../actions';
  
  const initialState = {
    nombre: '',
    apellido: '',
    telefonoMovil: '',
    telefonoFijo: '',
    direccion:{},
    email:'',
    nickname:'',
  }
  
  export default function personalData(state=initialState, action) {
      
    switch (action.type) {
      case PERSONALDATA:
        return action.personalData;
  
      default:
        return state;
    }
  }
  