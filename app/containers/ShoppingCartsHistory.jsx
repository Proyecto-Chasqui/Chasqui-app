import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { historyShoppingCarts, historyCartSelected } from '../actions';
import ShoppingCartsHistoryView from '../components/ShoppingCartsHistoryView';

const mapStateToProps = state => ({
    historyShoppingCarts : state.historyShoppingCarts,
    vendorSelected: state.vendorSelected,
    user: state.user,
    shoppingCarts: state.shoppingCarts,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ historyShoppingCarts, historyCartSelected }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ShoppingCartsHistoryView);