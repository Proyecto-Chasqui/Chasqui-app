import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import DetailGroupView from '../../components/groupsComponents/DetailGroupView';
import { memberSelected,  logout } from '../../actions';

const mapStateToProps = state => ({
    groupSelected : state.groupSelected,
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({memberSelected}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DetailGroupView);