export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const VENDORS = 'VENDORS';
export const OBTAINVENDORS = 'OBTAINVENDORS';
export const VENDORSTAGS = 'VENDORSTAGS';
export const PRODUCTIONSEALS = 'PRODUCTIONSEALS';
export const PRODUCTSEALS = 'PRODUCTSEALS';
export const VENDORSELECTED = 'VENDORSELECTED';
export const VENDORUNSELECTED = 'VENDORUNSELECTED';
export const PRODUCTS = 'PRODUCTS';
export const FLUSHPRODUCTS = 'FLUSHPRODUCTS';
export const PRODUCTSELECTED = 'PRODUCTSELECTED';
export const PRODUCTUNSELECTED = 'PRODUCTUNSELECTED';

export const login = userData => ({type: LOGIN, userData});
export const logout = () => ({type: LOGOUT});
export const vendors = stackVendors => ({type: VENDORS, stackVendors});
export const obtainVendors = () => ({type: OBTAINVENDORS});
export const vendorTags = stackTags => ({type:VENDORSTAGS, stackTags});
export const productSeals = productSealsStack =>({type:PRODUCTSEALS, productSealsStack});
export const productionSeals = productionSealsStack => ({type: PRODUCTIONSEALS, productionSealsStack});
export const vendorSelected = vendorSelectedData => ({type: VENDORSELECTED, vendorSelectedData});
export const vendorUnSelected = () => ({type: VENDORUNSELECTED});
export const products = (productStack) => ({type: PRODUCTS, productStack});
export const flushproducts = () => ({type: FLUSHPRODUCTS});
export const productSelected = (product) => ({type: PRODUCTSELECTED, product});
export const productUnselected = () => ({type: PRODUCTUNSELECTED})
