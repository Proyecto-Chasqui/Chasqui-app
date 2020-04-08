import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { shoppingCartSelected, shoppingCartUnselected } from '../../actions';
import OverlayShoppingCartView from '../../components/catalogViewComponents/OverlayShoppingCartView';

const mapStateToProps = state => ({
    shoppingCarts: state.shoppingCarts,
    shoppingCartSelected: state.shoppingCartSelected,
    vendorSelected: state.vendorSelected,
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({shoppingCartSelected, shoppingCartUnselected}, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(OverlayShoppingCartView);