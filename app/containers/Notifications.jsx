import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {unreadNotifications,} from '../actions';
import NotificationsView from '../components/NotificationsView';

const mapStateToProps = state => ({
  user: state.user,
  vendorSelected: state.vendorSelected,
  unreadNotifications: state.unreadNotifications,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({unreadNotifications}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotificationsView);
