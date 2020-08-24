import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { historyShoppingCarts,hasReceivedPushNotifications, historyCartSelected, logout, login, setPassword } from '../actions';
import ShoppingCartsHistoryView from '../components/ShoppingCartsHistoryView';

const mapStateToProps = state => ({
    historyShoppingCarts : state.historyShoppingCarts,
    vendorSelected: state.vendorSelected,
    user: state.user,
    shoppingCarts: state.shoppingCarts,
    hasReceivedPushNotifications: state.hasReceivedPushNotifications
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ historyShoppingCarts, hasReceivedPushNotifications, historyCartSelected, logout, login, setPassword }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ShoppingCartsHistoryView);