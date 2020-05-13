import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import GroupControlsOverlayView from '../../components/groupsComponents/GroupControlsOverlayView';
import { memberSelected,  logout, shoppingCartSelected, shoppingCarts, groupsData, groupSelected } from '../../actions';

const mapStateToProps = state => ({
    groupSelected : state.groupSelected,
    user:state.user,
    shoppingCartSelected: state.shoppingCartSelected,
    vendorSelected: state.vendorSelected,
    shoppingCarts: state.shoppingCarts,
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({shoppingCartSelected, shoppingCarts,groupsData,groupSelected}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupControlsOverlayView);