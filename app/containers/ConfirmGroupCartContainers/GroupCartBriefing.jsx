import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import GroupCartBriefingView from '../../components/confirmCartGroupComponents/GroupCartsBrefingView';
import { shoppingCartSelected, shoppingCartUnselected, shoppingCarts, logout } from '../../actions';

const mapStateToProps = state => ({
    shoppingCarts: state.shoppingCarts,
    shoppingCartSelected: state.shoppingCartSelected,
    vendorSelected: state.vendorSelected,
    user: state.user,
    groupSelected: state.groupSelected,
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({shoppingCartSelected, shoppingCartUnselected, shoppingCarts, logout}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupCartBriefingView);