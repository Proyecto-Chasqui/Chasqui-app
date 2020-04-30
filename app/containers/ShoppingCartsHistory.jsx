import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { historyShoppingCarts, historyCartSelected, logout, login, setPassword } from '../actions';
import ShoppingCartsHistoryView from '../components/ShoppingCartsHistoryView';

const mapStateToProps = state => ({
    historyShoppingCarts : state.historyShoppingCarts,
    vendorSelected: state.vendorSelected,
    user: state.user,
    shoppingCarts: state.shoppingCarts,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ historyShoppingCarts, historyCartSelected, logout, login, setPassword }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ShoppingCartsHistoryView);