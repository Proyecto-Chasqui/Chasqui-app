export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

export const login = userData => ({type: LOGIN, userData});
export const logout = () => ({type: LOGOUT});
