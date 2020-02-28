import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {vendors, obtainVendors, logout} from '../actions';
import VendorsView from '../components/VendorsView';

const mapStateToProps = state => ({
  vendors: state.vendors,
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({vendors, obtainVendors, logout}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VendorsView);