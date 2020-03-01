export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const VENDORS = 'VENDORS';
export const OBTAINVENDORS = 'OBTAINVENDORS';
export const VENDORSTAGS = 'VENDORSTAGS';

export const login = userData => ({type: LOGIN, userData});
export const logout = () => ({type: LOGOUT});
export const vendors = stackVendors => ({type: VENDORS, stackVendors});
export const obtainVendors = () => ({type: OBTAINVENDORS});
export const vendorTags = stackTags => ({type:VENDORSTAGS, stackTags});
