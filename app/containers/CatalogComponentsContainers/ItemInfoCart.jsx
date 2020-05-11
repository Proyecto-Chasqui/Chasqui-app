import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {productSelected, shoppingCartUnselected, logout, shoppingCarts,groupsData} from '../../actions';
import ItemInfoCartView from '../../components/catalogViewComponents/ItemInfoCartView';

const mapStateToProps = state => ({
    shoppingCartSelected: state.shoppingCartSelected,
    vendorSelected: state.vendorSelected,
    allProducts: state.allProducts,
    user: state.user,
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({productSelected, shoppingCartUnselected, logout, shoppingCarts,groupsData}, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ItemInfoCartView);