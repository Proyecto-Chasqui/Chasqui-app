import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { groupsData,groupSelected,hasReceivedPushNotifications, unreadNotifications, resetState, allProducts, shoppingCarts, shoppingCartUnselected, vendorSelected, personalData, adressesData, sellerPoints, products,vendorUnSelected,cleanZones,cleanSellerPoints, flushproducts, producers, logout, seals, productionSeals, productSeals, productCategories, zones } from '../actions';
import CatalogView from '../components/CatalogView';

const mapStateToProps = state => ({
  user: state.user,
  vendorSelected: state.vendorSelected,
  products: state.products,
  producers: state.producers,
  shoppingCarts: state.shoppingCarts,
  resetState: state.resetState,
  hasReceivedPushNotifications: state.hasReceivedPushNotifications,
  groupsData: state.groupsData,
  groupSelected: state.groupSelected,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({groupsData, resetState,
    vendorSelected, products,groupSelected,
    flushproducts, producers, logout, seals, productionSeals,
    cleanZones,cleanSellerPoints, vendorUnSelected, productSeals,
    productCategories, zones, sellerPoints, personalData, adressesData,
    shoppingCarts, shoppingCartUnselected, allProducts, unreadNotifications, hasReceivedPushNotifications
  }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CatalogView);