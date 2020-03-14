import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {} from '../actions';
import DeliveryZonesView from '../components/DeliveryZonesView';

const mapStateToProps = state => ({
  vendorSelected: state.vendorSelected,
  zones: state.zones,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DeliveryZonesView);