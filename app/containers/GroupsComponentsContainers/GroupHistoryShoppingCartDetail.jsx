import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import GroupHistoryShoppingCartDetailView from '../../components/groupsComponents/GroupHistoryShoppingCartDetailView';
import { memberSelected,  groupHistoryShoppingCarts, historyCartSelected } from '../../actions';

const mapStateToProps = state => ({
    groupSelected : state.groupSelected,
    user: state.user,
    groupHistoryShoppingCartSelected: state.groupHistoryShoppingCartSelected,
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({memberSelected, groupHistoryShoppingCarts, historyCartSelected}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupHistoryShoppingCartDetailView);