import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import ProductItemView from '../../components/confirmShoppingCartComponents/ProductItemView';
import {resetState, shoppingCartSelected, shoppingCartUnselected, shoppingCarts, logout, vendors, vendorSelected } from '../../actions';

const mapStateToProps = state => ({
    shoppingCarts: state.shoppingCarts,
    shoppingCartSelected: state.shoppingCartSelected,
    vendorSelected: state.vendorSelected,
    user: state.user,
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({resetState, vendors, vendorSelected, shoppingCartSelected, shoppingCartUnselected, shoppingCarts, logout}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProductItemView);