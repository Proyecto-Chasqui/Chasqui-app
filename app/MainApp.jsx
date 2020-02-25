import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {Provider} from 'react-redux';
import Login from './containers/Login';

const Stack = createStackNavigator();

const MainApp = ({store}) => (
  <Provider store={store}>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Bienvenidxs">
        <Stack.Screen name="Bienvenidxs"  options={{
          title: 'Bienvenidxs',
          headerStyle: {
            backgroundColor: 'rgba(51, 102, 255, 1)',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTitleAlign: "center"
        }} component={Login} />
      </Stack.Navigator>
    </NavigationContainer>
  </Provider>
);

export default MainApp;
