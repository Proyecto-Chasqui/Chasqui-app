import {
    HISTORYSHOPPINGCARTS,
} from '../actions';
  
const initialState = []
  
  export default function historyShoppingCarts(state=initialState, action) {
      
    switch (action.type) {
      case HISTORYSHOPPINGCARTS:
        return action.historyShoppingCartsStack;

      default:
        return state;
    }
}