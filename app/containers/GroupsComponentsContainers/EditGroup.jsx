import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import EditGroupView from '../../components/groupsComponents/EditGroupView';
import { groupsData, groupSelected, logout } from '../../actions';

const mapStateToProps = state => ({
    groupsData : state.groupsData,
    vendorSelected: state.vendorSelected,
    groupSelected:state.groupSelected,
    user: state.user,
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({groupsData, groupSelected, logout}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditGroupView);