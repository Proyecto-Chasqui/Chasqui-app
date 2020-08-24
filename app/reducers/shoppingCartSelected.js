import {
    SHOPPINGCARTSELECTED, SHOPPINGCARTUNSELECTED
} from '../actions';
  
const initialState = {}
  
  export default function shoppingCartSelected(state=initialState, action) {
      
    switch (action.type) {
      case SHOPPINGCARTSELECTED:
        return action.dataShoppingCartSelected;

      case SHOPPINGCARTUNSELECTED:
          return initialState;

      default:
        return state;
    }
}