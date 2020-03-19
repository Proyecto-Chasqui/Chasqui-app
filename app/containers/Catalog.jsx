import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { vendorSelected, sellerPoints, products,vendorUnSelected,cleanZones,cleanSellerPoints, flushproducts, producers, logout, seals, productionSeals, productSeals, productCategories, zones } from '../actions';
import CatalogView from '../components/CatalogView';

const mapStateToProps = state => ({
  user: state.user,
  vendorSelected: state.vendorSelected,
  products: state.products,
  producers: state.producers,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    vendorSelected, products,
    flushproducts, producers, logout, seals, productionSeals,cleanZones,cleanSellerPoints, vendorUnSelected, productSeals, productCategories, zones, sellerPoints
  }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CatalogView);