import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import GroupControlsOverlayView from '../../components/groupsComponents/GroupControlsOverlayView';
import { memberSelected,  logout } from '../../actions';

const mapStateToProps = state => ({
    groupSelected : state.groupSelected,
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupControlsOverlayView);