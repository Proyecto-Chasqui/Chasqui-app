import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { vendors, logout, vendorTags } from '../actions';
import VendorsView from '../components/VendorsView';

const mapStateToProps = state => ({
  user: state.user,
  vendorTags: state.vendorTags,
  vendors: state.vendors,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ vendors, logout, vendorTags }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VendorsView);