import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { resetState, productUnselected, producerSelected, sealsSelected, logout, shoppingCarts, shoppingCartSelected } from '../actions';
import ProductView from '../components/ProductView';

const mapStateToProps = state => ({
  productSelected: state.productSelected,
  producers: state.producers,
  seals: state.seals,
  vendorSelected: state.vendorSelected,
  shoppingCartSelected: state.shoppingCartSelected,
  shoppingCarts: state.shoppingCarts,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({resetState, productUnselected, producerSelected, sealsSelected, logout, shoppingCarts, shoppingCartSelected}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProductView);