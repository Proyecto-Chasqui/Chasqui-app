import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import GroupsControlsOverlayView from '../../components/groupsComponents/GroupsControlOveralyView'
import { groupsData,  logout, shoppingCarts, shoppingCartSelected } from '../../actions';

const mapStateToProps = state => ({
    groupsData : state.groupsData,
    shoppingCarts: state.shoppingCarts,
    invitationsData: state.invitationsData,
    vendorSelected:state.vendorSelected,
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({groupsData, shoppingCarts, logout,shoppingCartSelected}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupsControlsOverlayView);