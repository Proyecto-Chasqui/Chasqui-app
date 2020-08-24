import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import AdministrationMembersView from '../../components/groupsComponents/AdministrationMembersView';
import { groupsData, groupSelected, selectedNodeRequests, logout, hasReceivedPushNotifications } from '../../actions';

const mapStateToProps = state => ({
    groupSelected : state.groupSelected,
    user: state.user,
    vendorSelected: state.vendorSelected,
    groupsData: state.groupsData,
    selectedNodeRequests: state.selectedNodeRequests,
    hasReceivedPushNotifications: state.hasReceivedPushNotifications,
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({groupsData, groupSelected,logout, selectedNodeRequests, hasReceivedPushNotifications}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AdministrationMembersView);