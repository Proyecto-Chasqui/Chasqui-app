import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {} from '../actions';
import ConfirmShoppingCartView from '../components/ConfirmShoppingCartView';

const mapStateToProps = state => ({
  vendorSelected: state.vendorSelected,
  user: state.user,
  shoppingCartSelected: state.shoppingCartSelected,
  sellerPoints: state.sellerPoints,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConfirmShoppingCartView);