import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {openNodesData, accessOpenNodeRequests, logout, hasReceivedPushNotifications} from '../actions';
import OpenNodesView from '../components/OpenNodesView';

const mapStateToProps = state => ({
  vendorSelected: state.vendorSelected,
  invitationsData: state.invitationsData,
  openNodesData: state.openNodesData,
  groupsData: state.groupsData,
  accessOpenNodeRequests: state.accessOpenNodeRequests,
  user: state.user,
  hasReceivedPushNotifications: state.hasReceivedPushNotifications
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({openNodesData, accessOpenNodeRequests, logout, hasReceivedPushNotifications}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OpenNodesView);