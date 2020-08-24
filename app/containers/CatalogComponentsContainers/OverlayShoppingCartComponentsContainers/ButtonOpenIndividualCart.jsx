import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {  } from '../../../actions';
import ButtonOpenIndividualCart from '../../../components/catalogViewComponents/overlayShoppingCartViewComponents/ButtonOpenIndividualCart'

const mapStateToProps = state => ({
  vendorSelected: state.vendorSelected,
  shoppingCarts: state.shoppingCarts,
  shoppingCartSelected: state.shoppingCartSelected
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
  }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ButtonOpenIndividualCart);