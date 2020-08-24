import {
    GROUPHISTORYSHOPPINGCARTSELECTED,
} from '../actions';
  
const initialState = []
  
  export default function groupHistoryShoppingCartSelected(state=initialState, action) {
      
    switch (action.type) {
      case GROUPHISTORYSHOPPINGCARTSELECTED:
        return action.groupHistoryShoppingCartSelectedData;

      default:
        return state;
    }
}