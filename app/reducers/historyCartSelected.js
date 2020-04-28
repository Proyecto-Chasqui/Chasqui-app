import {
    HISTORYCARTSELECTED,
} from '../actions';
  
const initialState = {}
  
  export default function historyCartSelected(state=initialState, action) {
      
    switch (action.type) {
      case HISTORYCARTSELECTED:
        return action.historyCartSelectedData;

      default:
        return state;
    }
}