import {
    SELLERPOINTS, CLEANSELLERPOINT
} from '../actions';
  
const initialState = []
  
  export default function sellerPoints(state=initialState, action) {
      
    switch (action.type) {
      case SELLERPOINTS:
        return action.sellerPointsStack;

      case CLEANSELLERPOINT:
        return initialState;

      default:
        return state;
    }
}