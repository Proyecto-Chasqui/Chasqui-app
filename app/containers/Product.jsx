import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { productUnselected } from '../actions';
import ProductView from '../components/ProductView';

const mapStateToProps = state => ({
  productSelected: state.productSelected,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ productUnselected}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProductView);