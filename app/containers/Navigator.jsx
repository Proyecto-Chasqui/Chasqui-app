import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import NavigatorView from '../components/NavigatorView';
import {
  logout, groupsData, groupSelected, historyShoppingCarts, historyCartSelected,
  invitationsData, memberSelected, openNodesData, personalData, shoppingCartSelected, 
  shoppingCarts,accessOpenNodeRequests
} from '../actions';

const mapStateToProps = state => ({
  user: state.user,
  vendorSelected: state.vendorSelected,
  personalData: state.personalData
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    logout, groupsData, groupSelected,
    historyShoppingCarts, historyCartSelected, invitationsData,
    memberSelected, openNodesData, personalData, shoppingCartSelected,
    shoppingCarts, accessOpenNodeRequests
  }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavigatorView);