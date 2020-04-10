import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {logout, vendorUnSelected, shoppingCartUnselected, shoppingCarts} from '../../actions';
import NavigationOptionItemsView from '../../components/navigatorViewComponents/NavigationOptionItemsView';

const mapStateToProps = state => ({
  vendorSelected: state.vendorSelected,
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({logout, vendorUnSelected, shoppingCartUnselected, shoppingCarts}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavigationOptionItemsView);