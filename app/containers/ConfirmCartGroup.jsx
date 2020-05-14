import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {shoppingCartSelected, shoppingCarts, groupSelected,groupsData, unreadNotifications} from '../actions';
import ConfirmCartGroupView from '../components/ConfirmCartGroupView';

const mapStateToProps = state => ({
  vendorSelected: state.vendorSelected,
  user: state.user,
  shoppingCartSelected: state.shoppingCartSelected,
  sellerPoints: state.sellerPoints,
  groupSelected: state.groupSelected,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({shoppingCartSelected,shoppingCarts,groupSelected,groupsData, unreadNotifications}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConfirmCartGroupView);