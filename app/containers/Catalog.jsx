import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { allProducts, shoppingCarts, shoppingCartUnselected, vendorSelected, personalData, adressesData, sellerPoints, products,vendorUnSelected,cleanZones,cleanSellerPoints, flushproducts, producers, logout, seals, productionSeals, productSeals, productCategories, zones } from '../actions';
import CatalogView from '../components/CatalogView';

const mapStateToProps = state => ({
  user: state.user,
  vendorSelected: state.vendorSelected,
  products: state.products,
  producers: state.producers,
  shoppingCarts: state.shoppingCarts,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    vendorSelected, products,
    flushproducts, producers, logout, seals, productionSeals,
    cleanZones,cleanSellerPoints, vendorUnSelected, productSeals,
    productCategories, zones, sellerPoints, personalData, adressesData,
    shoppingCarts, shoppingCartUnselected, allProducts
  }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CatalogView);