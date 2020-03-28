import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {logout, vendorUnSelected} from '../../actions';
import NavigationOptionItemsView from '../../components/navigatorViewComponents/NavigationOptionItemsView';

const mapStateToProps = state => ({
  vendorSelected: state.vendorSelected,
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({logout, vendorUnSelected}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavigationOptionItemsView);