import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { productUnselected, producerSelected, sealsSelected, logout } from '../actions';
import ProductView from '../components/ProductView';

const mapStateToProps = state => ({
  productSelected: state.productSelected,
  producers: state.producers,
  seals: state.seals,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ productUnselected, producerSelected, sealsSelected, logout}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProductView);