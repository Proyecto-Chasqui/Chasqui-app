import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {  } from '../../actions';
import ProducerView from '../../components/catalogViewComponents/ProducerView';

const mapStateToProps = state => ({
    producerSelected: state.producerSelected
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({}, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ProducerView);