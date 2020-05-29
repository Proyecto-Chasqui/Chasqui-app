import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import MemberView from '../../components/groupsComponents/MemberView';
import { shoppingCartSelected, shoppingCartUnselected, shoppingCarts, logout } from '../../actions';

const mapStateToProps = state => ({
    groupSelected : state.groupSelected,
    memberSelected: state.memberSelected,
    vendorSelected: state.vendorSelected,
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MemberView);