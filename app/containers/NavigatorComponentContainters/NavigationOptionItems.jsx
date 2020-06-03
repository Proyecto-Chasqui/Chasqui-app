import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {logout, vendorUnSelected, hasReceivedPushNotifications, shoppingCartUnselected, shoppingCarts,groupsData, unreadNotifications} from '../../actions';
import NavigationOptionItemsView from '../../components/navigatorViewComponents/NavigationOptionItemsView';

const mapStateToProps = state => ({
  vendorSelected: state.vendorSelected,
  user: state.user,
  unreadNotifications: state.unreadNotifications,
  hasReceivedPushNotifications: state.hasReceivedPushNotifications,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({logout, vendorUnSelected, shoppingCartUnselected, shoppingCarts, groupsData,unreadNotifications, hasReceivedPushNotifications}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavigationOptionItemsView);