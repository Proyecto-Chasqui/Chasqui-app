import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {} from '../../actions'
import HistoryCartBriefingView from '../../components/ShoppingCartsHistoryComponents/HistoryCartBriefingView';

const mapStateToProps = state => ({
  vendorSelected: state.vendorSelected,
  historyCartSelected: state.historyCartSelected,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HistoryCartBriefingView);