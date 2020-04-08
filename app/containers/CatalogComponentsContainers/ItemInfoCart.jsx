import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {productSelected} from '../../actions';
import ItemInfoCartView from '../../components/catalogViewComponents/ItemInfoCartView';

const mapStateToProps = state => ({
    shoppingCartSelected: state.shoppingCartSelected,
    vendorSelected: state.vendorSelected,
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({productSelected}, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ItemInfoCartView);