import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {} from '../../actions';
import DeliveryAdressConfigView from '../../components/configurationViewComponents/DeliveryAdressConfigView';

const mapStateToProps = state => ({
  vendorSelected: state.vendorSelected,
  user: state.user, 
  adressesData: state.adressesData,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DeliveryAdressConfigView);