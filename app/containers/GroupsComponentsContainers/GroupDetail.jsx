import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import DetailGroupView from '../../components/groupsComponents/DetailGroupView';
import { memberSelected,  logout, selectedNodeRequests } from '../../actions';

const mapStateToProps = state => ({
    groupSelected : state.groupSelected,
    user: state.user,
    selectedNodeRequests: state.selectedNodeRequests,
    vendorSelected: state.vendorSelected,
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({memberSelected, selectedNodeRequests}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DetailGroupView);