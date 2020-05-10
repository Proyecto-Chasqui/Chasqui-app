import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { shoppingCartSelected, shoppingCartUnselected, shoppingCarts, logout, groupsData } from '../../actions';
import OverlayShoppingCartView from '../../components/catalogViewComponents/OverlayShoppingCartView';

const mapStateToProps = state => ({
    shoppingCarts: state.shoppingCarts,
    shoppingCartSelected: state.shoppingCartSelected,
    vendorSelected: state.vendorSelected,
    user: state.user,
    groupsData: state.groupsData,
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({groupsData, shoppingCartSelected, shoppingCartUnselected, shoppingCarts, logout}, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(OverlayShoppingCartView);