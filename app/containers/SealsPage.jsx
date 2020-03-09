import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { } from '../actions';
import SealsPageView from '../components/SealsPageView';

const mapStateToProps = state => ({
  sealsSelected: state.sealsSelected
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SealsPageView);