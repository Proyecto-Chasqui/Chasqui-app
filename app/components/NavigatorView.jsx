import React from 'react';
import Login from '../containers/Login';
import Vendors from '../containers/Vendors';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();
const state = {};
class NavigatorView extends React.Component {
    constructor(props) {
        super(props);
        state.isSignout = props.user.token == "";
    }  

    render() {
        return(
            <NavigationContainer>
            <Stack.Navigator initialRouteName="Bienvenidxs">
            {this.props.user.token == ""  ? (
            // No token found, user isn't signed in
            <Stack.Screen
            name="Bienvenidxs"
            component={Login}
            options={{
                title: 'Bienvenidxs',
                headerStyle: {
                    backgroundColor: 'rgba(51, 102, 255, 1)',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                headerTitleAlign: "center",
                animationTypeForReplace: state.isSignout ? 'pop' : 'push',
            }}
            />
            ) : (
            // User is signed in
            <Stack.Screen name='Catalogos' options={globalHeaderOptions("Catalogos")} component={Vendors} ></Stack.Screen>
            )}          
            
            </Stack.Navigator>
            </NavigationContainer>
            );
    }
}

const globalHeaderOptions = (vartitle) => {
    return(
      {
        title: vartitle,
        headerStyle: {
          backgroundColor: 'rgba(51, 102, 255, 1)',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitleAlign: "center"
      }
    );
  }

export default NavigatorView;