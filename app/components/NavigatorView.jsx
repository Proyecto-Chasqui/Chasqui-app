import React from 'react';
import Login from '../containers/Login';
import Vendors from '../containers/Vendors';
import SubNavigatorView from './SubNavigatorView';
import NavigationItems from '../containers/NavigatorComponentContainters/NavigationItems';
import NavigationOptionItems from '../containers/NavigatorComponentContainters/NavigationOptionItems';
import UserRegisterView from '../components/UserRegisterView';
import { Text, Header, Image } from 'react-native-elements';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { ScrollView, StyleSheet } from 'react-native';
import GLOBALS from '../Globals';

const StackLogin = createStackNavigator();

const DrawerCatalogs = createDrawerNavigator();

class NavigatorView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.logout = props.actions.logout;
    this.state = {
      isSignout: this.props.user.token == "",
      nickname: this.props.user.nickname,
    }
    this.serverBaseRoute = GLOBALS.BASE_URL;
    console.log("navigator", this.props.user.nickname)
  }

  componentDidUpdate(){
    if(this.state.nickname != this.props.user.nickname){
      this.forceUpdate();
      this.setState({nickname: this.props.user.nickname})
    }
  }

  createImageUrl(){
     let url = this.serverBaseRoute + (this.props.user.avatar.substring(1))
     url += '?random_number=' + new Date().getTime();
     return url
  }

  sideMenuComponent(props) {
    return (
      <ScrollView style={{ backgroundColor: "#ededed" }}>
        <Header containerStyle={{ backgroundColor: 'rgba(51, 102, 255, 1)' }}  >
          {this.props.user.id != 0 ? (
            <Image style={styles.userAvatar} source={{ uri: this.createImageUrl()}}></Image>
          ) : (
              <Image style={styles.userAvatar} source={require('./configurationViewComponents/configurationAssets/avatar_4.png')}></Image>
            )}

          <Text style={styles.nickText}>{this.state.nickname}</Text>
        </Header>
        <NavigationItems navigation={props.navigation}></NavigationItems>
        <NavigationOptionItems navigation={props.navigation}></NavigationOptionItems>
      </ScrollView>
    );
  }



  render() {
    return (
      <NavigationContainer>
        {this.props.user.token == "" ? (
          <StackLogin.Navigator>
            <StackLogin.Screen
              name="Bienvenidxs"
              component={Login}
              options={{
                headerShown: false,
                title: 'Bienvenidxs',
                animationTypeForReplace: this.state.isSignout ? 'pop' : 'push',
              }}
            />
            <StackLogin.Screen
              name="Registrarse"
              component={UserRegisterView}
              options={{
                headerShown: false,
                title: 'Registro',
                animationTypeForReplace: this.state.isSignout ? 'pop' : 'push',
              }}
            />
          </StackLogin.Navigator>
        ) : (
            <DrawerCatalogs.Navigator initialRouteName="Catalogos"
              edgeWidth= {0}
              drawerContentOptions={{
                activeTintColor: '#0066cc',
                itemStyle: { marginLeft: 20, marginRight: 20 },
              }}
              drawerContent={(props) => this.sideMenuComponent(props)}
            >
              <DrawerCatalogs.Screen  name='Catalogos' component={Vendors} />
              <DrawerCatalogs.Screen   name='Catalogo' component={SubNavigatorView} />
            </DrawerCatalogs.Navigator>
          )}
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  userAvatar: {
    width: 40,
    height: 40,
    resizeMode: 'cover',
    marginLeft: 15
  },
  nickText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    width: 150,
    marginLeft: 30,
    textTransform: "uppercase"
  },
  menuButton: {
    backgroundColor: '#66000000',
    alignSelf: 'flex-start',
  },
  menuButtonTitle: {
    color: "black",
    alignSelf: 'flex-end'
  },

  iconMenuButton: {
    marginRight: 15,
    color: "rgba(51, 102, 255, 1)"
  },

});

export default NavigatorView;