export const RESETSTATE = 'RESETSTATE';
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const SETPASSWORD = 'SETPASSWORD';
export const VENDORS = 'VENDORS';
export const OBTAINVENDORS = 'OBTAINVENDORS';
export const VENDORSTAGS = 'VENDORSTAGS';
export const PRODUCTIONSEALS = 'PRODUCTIONSEALS';
export const PRODUCTSEALS = 'PRODUCTSEALS';
export const SEALS = 'SEALS';
export const SEALSSELECTED = 'SEALSSELECTED';
export const VENDORSELECTED = 'VENDORSELECTED';
export const VENDORUNSELECTED = 'VENDORUNSELECTED';
export const PRODUCTS = 'PRODUCTS';
export const FLUSHPRODUCTS = 'FLUSHPRODUCTS';
export const ALLPRODUCTS = 'ALLPRODUCTS';
export const ALLFLUSHPRODUCTS = 'ALLFLUSHPRODUCTS';
export const PRODUCTSELECTED = 'PRODUCTSELECTED';
export const PRODUCTUNSELECTED = 'PRODUCTUNSELECTED';
export const PRODUCERS = 'PRODUCERS';
export const PRODUCERSELECTED = 'PRODUCERSELECTED';
export const PRODUCTCATEGORIES = 'PRODUCTCATEGORIES';
export const ZONES = 'ZONES';
export const CLEANZONES = 'CLEANZONES';
export const SELLERPOINTS = 'SELLERPOINTS';
export const CLEANSELLERPOINT = 'CLEANSELLERPOINT';
export const PERSONALDATA = 'PERSONALDATA';
export const ADRESSESDATA = 'ADRESSESDATA';
export const SHOPPINGCARTS = 'SHOPPINGCARTS';
export const HISTORYSHOPPINGCARTS = 'HISTORYSHOPPINGCARTS';
export const HISTORYCARTSELECTED = 'HISTORYCARTSELECTED';
export const SHOPPINGCARTSELECTED = 'SHOPPINGCARTSELECTED';
export const SHOPPINGCARTUNSELECTED = 'SHOPPINGCARTUNSELECTED';
export const UNREADNOTIFICATIONS = 'UNREADNOTIFICATIONS';
export const GROUPSDATA = 'GROUPSDATA';
export const GROUPSELECTED = 'GROUPSELECTED';
export const MEMBERSELECTED = 'MEMBERSELECTED';
export const INVITATIONS = 'INVITATIONS';
export const GROUPHISTORYSHOPPINGCARTS = 'GROUPHISTORYSHOPPINGCARTS';
export const GROUPHISTORYSHOPPINGCARTSELECTED = 'GROUPHISTORYSHOPPINGCARTSELECTED';
export const OPENNODESDATA = 'OPENNODESDATA';
export const ACCESSOPENNODEREQUESTS = 'ACCESSOPENNODEREQUESTS';
export const SELECTEDNODEREQUESTS ='SELECTEDNODEREQUESTS';
export const HASRECEIVEDPUSHNOTIFICATIONS = 'HASRECEIVEDPUSHNOTIFICATIONS';
export const HASRECEIVEDEXPIREDCARTNOTIFICATION = 'HASRECEIVEDEXPIREDCARTNOTIFICATION';
export const INFODATAVENDORSELECTED = 'INFODATAVENDORSELECTED';
export const INFODATAVENDORUNSELECTED = 'INFODATAVENDORUNSELECTED';

export const resetState = (resetDataState) => ({type:RESETSTATE, resetDataState})
export const login = userData => ({type: LOGIN, userData});
export const logout = () => ({type: LOGOUT});
export const setPassword = (passwordData) => ({type: SETPASSWORD, passwordData});
export const vendors = stackVendors => ({type: VENDORS, stackVendors});
export const obtainVendors = () => ({type: OBTAINVENDORS});
export const vendorTags = stackTags => ({type:VENDORSTAGS, stackTags});
export const seals = sealsStack =>({type:SEALS, sealsStack});
export const sealsSelected = sealsSelected =>({type:SEALSSELECTED, sealsSelected});
export const productionSeals = productionSealsStack => ({type: PRODUCTIONSEALS, productionSealsStack});
export const productSeals = productSealsStack => ({type: PRODUCTSEALS, productSealsStack});
export const vendorSelected = vendorSelectedData => ({type: VENDORSELECTED, vendorSelectedData});
export const vendorUnSelected = () => ({type: VENDORUNSELECTED});
export const products = (productStack) => ({type: PRODUCTS, productStack});
export const flushproducts = () => ({type: FLUSHPRODUCTS});
export const allProducts = (allProductsStack) => ({type:ALLPRODUCTS,allProductsStack});
export const allFlushProducts = () => ({type:ALLFLUSHPRODUCTS});
export const productSelected = (product) => ({type: PRODUCTSELECTED, product});
export const productUnselected = () => ({type: PRODUCTUNSELECTED});
export const producers = (producersStack) => ({type:PRODUCERS, producersStack});
export const producerSelected = (producer) => ({type: PRODUCERSELECTED, producer});
export const productCategories = (categoriesStack) => ({type: PRODUCTCATEGORIES, categoriesStack});
export const zones = (zoneStack) => ({type:ZONES, zoneStack});
export const cleanZones = () => ({type:CLEANZONES});
export const sellerPoints = (sellerPointsStack) => ({type:SELLERPOINTS, sellerPointsStack});
export const cleanSellerPoints = () => ({type:CLEANSELLERPOINT})
export const personalData = (personalData) =>({type:PERSONALDATA, personalData});
export const adressesData = (adressesData) => ({type:ADRESSESDATA, adressesData});
export const shoppingCarts = (shoppingCartsStack) => ({type:SHOPPINGCARTS, shoppingCartsStack});
export const shoppingCartSelected = (dataShoppingCartSelected) => ({type:SHOPPINGCARTSELECTED, dataShoppingCartSelected});
export const shoppingCartUnselected = () => ({type:SHOPPINGCARTUNSELECTED});
export const unreadNotifications = (unreadNotificationsData) => ({type:UNREADNOTIFICATIONS, unreadNotificationsData});
export const historyShoppingCarts = (historyShoppingCartsStack) => ({type:HISTORYSHOPPINGCARTS, historyShoppingCartsStack});
export const historyCartSelected = (historyCartSelectedData) => ({type:HISTORYCARTSELECTED, historyCartSelectedData});
export const groupsData = (groupsStack) => ({type:GROUPSDATA, groupsStack});
export const groupSelected = (groupSelectedData) => ({type: GROUPSELECTED, groupSelectedData});
export const memberSelected = (memberData) => ({type:MEMBERSELECTED, memberData});
export const invitationsData = (invitationsStack) => ({type:INVITATIONS, invitationsStack});
export const groupHistoryShoppingCarts = (groupHistoryShoppingCartsStack) =>({type:GROUPHISTORYSHOPPINGCARTS, groupHistoryShoppingCartsStack})
export const groupHistoryShoppingCartSelected = (groupHistoryShoppingCartSelectedData) => ({type:GROUPHISTORYSHOPPINGCARTSELECTED, groupHistoryShoppingCartSelectedData})
export const openNodesData = (openNodesStack) => ({type:OPENNODESDATA, openNodesStack})
export const accessOpenNodeRequests = (accessOpenNodeRequestsStack) => ({type:ACCESSOPENNODEREQUESTS, accessOpenNodeRequestsStack})
export const selectedNodeRequests = (selectedNodeRequestsStack) => ({type:SELECTEDNODEREQUESTS, selectedNodeRequestsStack})
export const hasReceivedPushNotifications = (hasReceivedPushNotificationsValue) => ({type:HASRECEIVEDPUSHNOTIFICATIONS, hasReceivedPushNotificationsValue})
export const hasReceivedExpiredCartNotification = (hasReceivedExpiredCartNotificationValue) => ({type:HASRECEIVEDEXPIREDCARTNOTIFICATION, hasReceivedExpiredCartNotificationValue})
export const infoDataVendorSelected = (dataVendorSelected) => ({type:INFODATAVENDORSELECTED, dataVendorSelected})
export const infoDataVendorUnselected = () => ({type:INFODATAVENDORUNSELECTED})