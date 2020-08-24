import React from 'react';
import {Provider} from 'react-redux';
import Navigator from './containers/Navigator';

const MainApp = ({store}) => (
  <Provider store={store}>
    <Navigator></Navigator>
  </Provider>
);

export default MainApp;
