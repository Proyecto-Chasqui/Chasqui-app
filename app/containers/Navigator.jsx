import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import NavigatorView from '../components/NavigatorView';
import {logout} from '../actions';

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({logout}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavigatorView);