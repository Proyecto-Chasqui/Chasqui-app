import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import NodeRequestView from '../../components/groupsComponents/NodeRequestView';
import { groupsData } from '../../actions';

const mapStateToProps = state => ({
    groupsData : state.groupsData,
    vendorSelected: state.vendorSelected,
    user: state.user,
    adressesData: state.adressesData,
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({groupsData}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NodeRequestView);