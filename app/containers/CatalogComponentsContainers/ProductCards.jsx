import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ProductCardsView from '../../components/catalogViewComponents/ProductCardsView';

const mapStateToProps = state => ({
    products: state.products
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({ }, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ProductCardsView);