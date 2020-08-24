import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import ShippingSelectionView from '../../components/confirmShoppingCartComponents/ShippingSelectionView';
import { } from '../../actions';

const mapStateToProps = state => ({
    shoppingCarts: state.shoppingCarts,
    shoppingCartSelected: state.shoppingCartSelected,
    vendorSelected: state.vendorSelected,
    user: state.user,
    adressesData: state.adressesData,
    sellerPoints: state.sellerPoints,
    zones: state.zones,
    groupSelected: state.groupSelected,
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ShippingSelectionView);