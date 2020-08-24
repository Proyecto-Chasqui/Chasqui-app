import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {vendors, vendorTags, logout } from '../../actions';
import VendorFiltersView from '../../components/vendorsViewComponents/VendorFiltersView';

const mapStateToProps = state => ({
  vendorTags: state.vendorTags,
  vendors: state.vendors,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({vendors, vendorTags, logout}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VendorFiltersView);