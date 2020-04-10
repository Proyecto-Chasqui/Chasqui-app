import {
    ALLPRODUCTS, ALLFLUSHPRODUCTS,
  } from '../actions';
 //This reducer is for keep the original products without filters
  const initialState = [];
  
  export default function allProducts(state=initialState, action) {
      
    switch (action.type) {
      case ALLPRODUCTS:
        return action.allProductsStack;
      
      case ALLFLUSHPRODUCTS:
        return initialState;
        
      default:
        return state;
    }
  }