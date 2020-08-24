import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {} from '../actions';
import ConfigurationView from '../components/ConfigurationView';

const mapStateToProps = state => ({
  vendorSelected: state.vendorSelected,
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConfigurationView);