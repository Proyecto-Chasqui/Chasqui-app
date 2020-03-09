import {
  PRODUCTSELECTED, PRODUCTUNSELECTED
} from '../actions';

const initialState = {
  
}

export default function productSelected(state=initialState, action) {
  
  switch (action.type) {

    case PRODUCTSELECTED:   
      return action.product;

    case PRODUCTUNSELECTED:
      return initialState;

    default:
      return state;
  }
}