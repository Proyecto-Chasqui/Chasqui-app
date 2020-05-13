import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import AdministrationMembersView from '../../components/groupsComponents/AdministrationMembersView';
import { groupsData, groupSelected } from '../../actions';

const mapStateToProps = state => ({
    groupSelected : state.groupSelected,
    user: state.user,
    vendorSelected: state.vendorSelected,
    groupsData: state.groupsData,
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({groupsData, groupSelected}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AdministrationMembersView);