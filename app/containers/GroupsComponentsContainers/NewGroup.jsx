import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import NewGroupView from '../../components/groupsComponents/NewGroupView';
import { groupsData, logout } from '../../actions';

const mapStateToProps = state => ({
    groupsData : state.groupsData,
    vendorSelected: state.vendorSelected,
    user: state.user,
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({groupsData, logout}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewGroupView);