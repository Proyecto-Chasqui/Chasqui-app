import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {openNodesData} from '../actions';
import OpenNodesView from '../components/OpenNodesView';

const mapStateToProps = state => ({
  vendorSelected: state.vendorSelected,
  invitationsData: state.invitationsData,
  openNodesData: state.openNodesData,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({openNodesData}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OpenNodesView);