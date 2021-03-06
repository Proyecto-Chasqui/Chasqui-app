import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {login, setPassword, logout} from '../../actions';
import PasswordConfigView from '../../components/configurationViewComponents/PasswordConfigView';

const mapStateToProps = state => ({
  vendorSelected: state.vendorSelected,
  user: state.user, 
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({login, setPassword, logout}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PasswordConfigView);