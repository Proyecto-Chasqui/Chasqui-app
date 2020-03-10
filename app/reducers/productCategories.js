import {
    PRODUCTCATEGORIES
  } from '../actions';
  
  const initialState = []
  
  export default function productCategories(state=initialState, action) {
      
    switch (action.type) {
      case PRODUCTCATEGORIES:
        return action.categoriesStack;
  
      default:
        return state;
    }
  }