import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {logout} from '../../actions';
import DeliveryAdressConfigView from '../../components/configurationViewComponents/DeliveryAdressConfigView';

const mapStateToProps = state => ({
  vendorSelected: state.vendorSelected,
  user: state.user, 
  adressesData: state.adressesData,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({logout}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DeliveryAdressConfigView);