import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { productSelected, productUnselected } from '../../actions';
import ProductCardsView from '../../components/catalogViewComponents/ProductCardsView';

const mapStateToProps = state => ({
    products: state.products,
    vendorSelected: state.vendorSelected,
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({productSelected, productUnselected }, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ProductCardsView);