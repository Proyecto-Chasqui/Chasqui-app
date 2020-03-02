import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {vendors} from '../actions';
import VendorMultipleCardsView from '../components/vendorsViewComponents/VendorMultipleCardsView';

const mapStateToProps = state => ({
  vendors: state.vendors,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({vendors}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VendorMultipleCardsView);