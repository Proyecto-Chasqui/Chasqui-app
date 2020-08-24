import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import ConfirmCartView from '../../components/confirmShoppingCartComponents/ConfirmCartView';
import { shoppingCartSelected, shoppingCartUnselected, shoppingCarts, logout } from '../../actions';

const mapStateToProps = state => ({
    shoppingCarts: state.shoppingCarts,
    shoppingCartSelected: state.shoppingCartSelected,
    vendorSelected: state.vendorSelected,
    user: state.user,
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({shoppingCartSelected, shoppingCartUnselected, shoppingCarts, logout}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConfirmCartView);