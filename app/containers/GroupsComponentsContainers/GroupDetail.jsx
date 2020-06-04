import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import DetailGroupView from '../../components/groupsComponents/DetailGroupView';
import { memberSelected,  logout, selectedNodeRequests, hasReceivedPushNotifications } from '../../actions';

const mapStateToProps = state => ({
    groupSelected : state.groupSelected,
    user: state.user,
    selectedNodeRequests: state.selectedNodeRequests,
    vendorSelected: state.vendorSelected,
    hasReceivedPushNotifications: state.hasReceivedPushNotifications,
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({memberSelected, selectedNodeRequests,logout, hasReceivedPushNotifications}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DetailGroupView);