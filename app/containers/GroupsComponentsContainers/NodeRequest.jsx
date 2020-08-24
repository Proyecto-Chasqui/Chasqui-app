import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import NodeRequestView from '../../components/groupsComponents/NodeRequestView';
import { groupsData, groupSelected, logout } from '../../actions';

const mapStateToProps = state => ({
    groupsData : state.groupsData,
    vendorSelected: state.vendorSelected,
    user: state.user,
    adressesData: state.adressesData,
    groupSelected: state.groupSelected,
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({groupsData, groupSelected, logout}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NodeRequestView);