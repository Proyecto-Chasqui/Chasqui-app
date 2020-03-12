import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {producers, productionSeals, productSeals, productCategories, products, logout} from '../../actions';
import ProductFilterView from '../../components/catalogViewComponents/ProductFilterView';

const mapStateToProps = state => ({
    producers: state.producers,
    productionSeals: state.productionSeals,
    productSeals: state.productSeals,
    productCategories: state.productCategories,
    vendorSelected: state.vendorSelected,
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({producers, productionSeals, productSeals, productCategories,products, logout}, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ProductFilterView);