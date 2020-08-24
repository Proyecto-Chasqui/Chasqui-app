import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import ConfirmGroupCartView from '../../components/confirmCartGroupComponents/ConfirmGroupCartView';
import { shoppingCartSelected, shoppingCartUnselected, shoppingCarts, logout, groupSelected } from '../../actions';

const mapStateToProps = state => ({
    vendorSelected: state.vendorSelected,
    user: state.user,
    groupSelected: state.groupSelected,
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({shoppingCartSelected, shoppingCartUnselected, shoppingCarts, logout, groupSelected}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConfirmGroupCartView);