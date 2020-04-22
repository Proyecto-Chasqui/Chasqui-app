import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { vendors, logout, vendorTags, vendorSelected, resetState } from '../actions';
import VendorsView from '../components/VendorsView';

const mapStateToProps = state => ({
  user: state.user,
  vendorTags: state.vendorTags,
  vendors: state.vendors,
  vendorSelected: state.vendorSelected,
  resetState: state.resetState,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ vendors, logout, vendorTags, vendorSelected, resetState }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VendorsView);