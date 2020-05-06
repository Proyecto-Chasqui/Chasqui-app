import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {groupsData} from '../actions';
import GroupsView from '../components/GroupsView';

const mapStateToProps = state => ({
  vendorSelected: state.vendorSelected,
  groupsData: state.groupsData
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({groupsData}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupsView);