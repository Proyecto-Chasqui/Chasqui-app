import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import InvitationsView from '../../components/groupsComponents/InvitationsView'
import { groupsData,  logout, shoppingCarts, unreadNotifications, invitationsData} from '../../actions';

const mapStateToProps = state => ({
    groupsData : state.groupsData,
    unreadNotifications: state.unreadNotifications,
    vendorSelected: state.vendorSelected,
    invitationsData: state.invitationsData,
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({groupsData, shoppingCarts, logout, unreadNotifications, invitationsData}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(InvitationsView);