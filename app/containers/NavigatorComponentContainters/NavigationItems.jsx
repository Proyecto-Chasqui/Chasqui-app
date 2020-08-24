import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {vendorUnSelected,flushproducts, shoppingCartUnselected, groupsData} from '../../actions'
import NavigationItemsView from '../../components/navigatorViewComponents/NavigationItemsView';

const mapStateToProps = state => ({
  vendorSelected: state.vendorSelected,
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({vendorUnSelected, flushproducts, shoppingCartUnselected, groupsData}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavigationItemsView);