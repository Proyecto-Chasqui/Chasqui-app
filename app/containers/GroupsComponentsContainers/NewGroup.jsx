import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import NewGroupView from '../../components/groupsComponents/NewGroupView';
import { groupsData } from '../../actions';

const mapStateToProps = state => ({
    groupsData : state.groupsData,
    vendorSelected: state.vendorSelected,
    user: state.user,
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({groupsData}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewGroupView);