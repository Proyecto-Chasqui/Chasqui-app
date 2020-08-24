import { VENDORSTAGS
  } from '../actions';
  
  const initialState = {
    tagsTipoOrganizacion:[],
    tagsTipoProducto:[],
    tagsZonaDeCobertura:[]
  }
  
  export default function vendorTags(state=initialState, action) {
      
    switch (action.type) {
      case VENDORSTAGS:
        return action.stackTags;

      default:
        return state;
    }
  }