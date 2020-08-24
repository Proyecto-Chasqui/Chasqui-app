import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import GroupHistoryShoppingCartDetailView from '../../components/groupsComponents/GroupHistoryShoppingCartDetailView';
import { memberSelected,  groupHistoryShoppingCarts, historyCartSelected, logout } from '../../actions';

const mapStateToProps = state => ({
    groupSelected : state.groupSelected,
    user: state.user,
    groupHistoryShoppingCartSelected: state.groupHistoryShoppingCartSelected,
    vendorSelected: state.vendorSelected,
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({memberSelected, groupHistoryShoppingCarts, historyCartSelected, logout}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupHistoryShoppingCartDetailView);