import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {  } from '../../../actions';
import ButtonOpenGroupCart from '../../../components/catalogViewComponents/overlayShoppingCartViewComponents/ButtonOpenGroupCart'

const mapStateToProps = state => ({
  vendorSelected: state.vendorSelected,
  shoppingCarts: state.shoppingCarts,
  shoppingCartSelected: state.shoppingCartSelected,
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
  }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ButtonOpenGroupCart);