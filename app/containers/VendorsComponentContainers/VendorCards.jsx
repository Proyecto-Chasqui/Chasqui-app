import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {vendors} from '../../actions';
import VendorCardsView from '../../components/vendorsViewComponents/VendorCardsView';

const mapStateToProps = state => ({
  vendors: state.vendors,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({vendors}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VendorCardsView);