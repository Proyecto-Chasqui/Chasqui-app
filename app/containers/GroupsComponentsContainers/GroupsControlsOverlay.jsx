import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import GroupsControlsOverlayView from '../../components/groupsComponents/GroupsControlOveralyView'
import { groupsData,  logout } from '../../actions';

const mapStateToProps = state => ({
    groupsData : state.groupsData,
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({groupsData}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupsControlsOverlayView);