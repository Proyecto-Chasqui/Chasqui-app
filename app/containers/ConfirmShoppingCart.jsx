import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {shoppingCartSelected, shoppingCarts, unreadNotifications, logout} from '../actions';
import ConfirmShoppingCartView from '../components/ConfirmShoppingCartView';

const mapStateToProps = state => ({
  vendorSelected: state.vendorSelected,
  user: state.user,
  shoppingCartSelected: state.shoppingCartSelected,
  sellerPoints: state.sellerPoints,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({shoppingCartSelected,shoppingCarts, unreadNotifications,logout}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConfirmShoppingCartView);