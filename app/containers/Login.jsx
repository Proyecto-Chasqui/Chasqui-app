import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {login, logout} from '../actions';
import LoginView from '../components/LoginView';

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({login, logout}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginView);
