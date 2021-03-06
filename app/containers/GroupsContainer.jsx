import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {groupsData, hasReceivedPushNotifications, groupSelected, logout, unreadNotifications, invitationsData} from '../actions';
import GroupsView from '../components/GroupsView';

const mapStateToProps = state => ({
  vendorSelected: state.vendorSelected,
  groupsData: state.groupsData,
  invitationsData: state.invitationsData,
  user: state.user,
  hasReceivedPushNotifications: state.hasReceivedPushNotifications
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({groupsData, groupSelected, hasReceivedPushNotifications, logout, unreadNotifications, invitationsData}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupsView);