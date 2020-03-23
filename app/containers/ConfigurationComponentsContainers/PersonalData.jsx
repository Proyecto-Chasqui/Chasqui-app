import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { personalData, login } from '../../actions';
import PersonalDataView from '../../components/configurationViewComponents/personalDataView';

const mapStateToProps = state => ({
    personalData: state.personalData,
    user: state.user
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({ personalData, login }, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(PersonalDataView);