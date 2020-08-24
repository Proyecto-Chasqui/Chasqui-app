import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {adressesData, logout} from '../actions';
import AdressManagmentView from '../components/AdressManagmentView';

const mapStateToProps = state => ({
  vendorSelected: state.vendorSelected,
  user: state.user,
  adressesData: state.adressesData,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({adressesData, logout}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AdressManagmentView);