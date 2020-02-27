import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {vendors, obtainVendors} from '../actions';
import VendorsView from '../components/VendorsView';

const mapStateToProps = state => ({
  vendors: state.vendors
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({vendors, obtainVendors}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VendorsView);