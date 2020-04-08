import {
    SHOPPINGCARTS,
} from '../actions';
  
const initialState = []
  
  export default function shoppingCarts(state=initialState, action) {
      
    switch (action.type) {
      case SHOPPINGCARTS:
        return action.shoppingCartsStack;

      default:
        return state;
    }
}