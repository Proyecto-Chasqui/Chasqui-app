import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import NavigatorView from '../components/NavigatorView';
import {
  logout, groupsData, groupSelected, historyShoppingCarts, historyCartSelected,
  invitationsData, memberSelected, openNodesData, personalData, shoppingCartSelected, 
  shoppingCarts,accessOpenNodeRequests, hasReceivedPushNotifications
} from '../actions';

const mapStateToProps = state => ({
  user: state.user,
  vendorSelected: state.vendorSelected,
  personalData: state.personalData,
  hasReceivedPushNotifications: state.hasReceivedPushNotifications,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    logout, groupsData, groupSelected,
    historyShoppingCarts, historyCartSelected, invitationsData,
    memberSelected, openNodesData, personalData, shoppingCartSelected,
    shoppingCarts, accessOpenNodeRequests, hasReceivedPushNotifications
  }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavigatorView);