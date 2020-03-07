import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {logout} from '../../actions';
import NavigationOptionItemsView from '../../components/navigatorViewComponents/NavigationOptionItemsView';

const mapStateToProps = state => ({
  vendorSelected: state.vendorSelected,
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({logout}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavigationOptionItemsView);