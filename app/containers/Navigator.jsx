import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
//import {vendors, obtainVendors} from '../actions';
import NavigatorView from '../components/NavigatorView';

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavigatorView);