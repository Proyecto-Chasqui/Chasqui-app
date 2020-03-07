import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {vendorSelected, products} from '../actions';
import CatalogView from '../components/CatalogView';

const mapStateToProps = state => ({
  user: state.user,
  vendorSelected: state.vendorSelected,
  products: state.products
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({vendorSelected, products}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CatalogView);