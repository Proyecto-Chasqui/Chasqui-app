import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {vendors} from '../actions';
import VendorSingleCardView from '../components/vendorsViewComponents/VendorSingleCardView';

const mapStateToProps = state => ({
  vendors: state.vendors,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({vendors}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VendorSingleCardView);