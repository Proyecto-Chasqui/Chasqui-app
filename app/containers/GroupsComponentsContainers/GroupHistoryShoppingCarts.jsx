import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import GroupHistoryShoppingCartsView from '../../components/groupsComponents/GroupHistoryShoppingCartsView';
import { memberSelected, groupHistoryShoppingCarts, groupHistoryShoppingCartSelected, logout } from '../../actions';

const mapStateToProps = state => ({
    groupSelected : state.groupSelected,
    user: state.user,
    groupHistoryShoppingCarts: state.groupHistoryShoppingCarts,
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({memberSelected, groupHistoryShoppingCarts, groupHistoryShoppingCartSelected}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupHistoryShoppingCartsView);