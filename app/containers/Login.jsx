import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {login, logout,setPassword} from '../actions';
import LoginView from '../components/LoginView';

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({login, logout,setPassword}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginView);
