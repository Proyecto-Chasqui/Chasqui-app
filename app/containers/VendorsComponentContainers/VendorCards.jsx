import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {vendors, vendorSelected} from '../../actions';
import VendorCardsView from '../../components/vendorsViewComponents/VendorCardsView';

const mapStateToProps = state => ({
  vendors: state.vendors,
  vendorSelected: state.vendorSelected
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({vendors, vendorSelected}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VendorCardsView);