import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {unreadNotifications, hasReceivedPushNotifications} from '../actions';
import NotificationsView from '../components/NotificationsView';

const mapStateToProps = state => ({
  user: state.user,
  vendorSelected: state.vendorSelected,
  unreadNotifications: state.unreadNotifications,
  hasReceivedPushNotifications: state.hasReceivedPushNotifications
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({unreadNotifications, hasReceivedPushNotifications}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotificationsView);
