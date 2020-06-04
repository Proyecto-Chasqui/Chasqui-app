import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {unreadNotifications, hasReceivedPushNotifications, logout} from '../actions';
import NotificationsView from '../components/NotificationsView';

const mapStateToProps = state => ({
  user: state.user,
  vendorSelected: state.vendorSelected,
  unreadNotifications: state.unreadNotifications,
  hasReceivedPushNotifications: state.hasReceivedPushNotifications
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({unreadNotifications, hasReceivedPushNotifications, logout}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotificationsView);
