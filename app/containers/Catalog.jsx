import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {vendorSelected, products,flushproducts, producers, logout, seals, productionSeals, productSeals, productCategories} from '../actions';
import CatalogView from '../components/CatalogView';

const mapStateToProps = state => ({
  user: state.user,
  vendorSelected: state.vendorSelected,
  products: state.products,
  producers: state.producers,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({vendorSelected, products,flushproducts,producers, logout, seals, productionSeals, productSeals, productCategories}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CatalogView);