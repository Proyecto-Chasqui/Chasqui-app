import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { personalData, login, logout } from '../../actions';
import PersonalDataView from '../../components/configurationViewComponents/PersonalDataView';

const mapStateToProps = state => ({
    personalData: state.personalData,
    user: state.user
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({ personalData, login, logout }, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(PersonalDataView);