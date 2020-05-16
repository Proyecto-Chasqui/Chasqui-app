import {
    GROUPHISTORYSHOPPINGCARTS,
} from '../actions';
  
const initialState = []
  
  export default function groupHistoryShoppingCarts(state=initialState, action) {
      
    switch (action.type) {
      case GROUPHISTORYSHOPPINGCARTS:
        return action.groupHistoryShoppingCartsStack;

      default:
        return state;
    }
}