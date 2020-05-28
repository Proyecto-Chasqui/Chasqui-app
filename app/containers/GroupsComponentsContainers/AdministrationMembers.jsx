import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import AdministrationMembersView from '../../components/groupsComponents/AdministrationMembersView';
import { groupsData, groupSelected, selectedNodeRequests } from '../../actions';

const mapStateToProps = state => ({
    groupSelected : state.groupSelected,
    user: state.user,
    vendorSelected: state.vendorSelected,
    groupsData: state.groupsData,
    selectedNodeRequests: state.selectedNodeRequests,
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({groupsData, groupSelected, selectedNodeRequests}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AdministrationMembersView);