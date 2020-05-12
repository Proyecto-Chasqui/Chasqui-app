import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import AdministrationMembersView from '../../components/groupsComponents/AdministrationMembersView';
import { logout } from '../../actions';

const mapStateToProps = state => ({
    groupSelected : state.groupSelected,
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AdministrationMembersView);