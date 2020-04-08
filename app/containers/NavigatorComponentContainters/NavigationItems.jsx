import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {vendorUnSelected,flushproducts, shoppingCartUnselected} from '../../actions'
import NavigationItemsView from '../../components/navigatorViewComponents/NavigationItemsView';

const mapStateToProps = state => ({
  vendorSelected: state.vendorSelected
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({vendorUnSelected, flushproducts, shoppingCartUnselected}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavigationItemsView);