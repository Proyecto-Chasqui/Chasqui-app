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
import { ScrollView, StyleSheet,  Vibration, Platform, Alert } from 'react-native';
import GLOBALS from '../Globals';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import axios from 'axios';

const StackLogin = createStackNavigator();

const DrawerCatalogs = createDrawerNavigator();

class NavigatorView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.logout = props.actions.logout;
    this.state = {
      lastAccessId: this.props.user.id,
      isSignout: this.props.user.token == "",
      nickname: this.props.user.nickname,
      expoPushToken: '',
      notification: {},
    }
    this.serverBaseRoute = GLOBALS.BASE_URL;
  }

  registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        Alert.alert('No se logro obtener el permiso para las notificaciones, puede usar la aplicación pero perderá ciertas sincronizaciones necesarias en compras colectivas.');
        return;
      }
      let token = await Notifications.getExpoPushTokenAsync();
      this.setState({ expoPushToken: token });
      this.registerTokenOnServer(token.toString());
    } else {
      Alert.alert('Las notificaciones solo funcionan en dispositivos fisicos');
    }

    if (Platform.OS === 'android') {
      Notifications.createChannelAndroidAsync('default', {
        name: 'default',
        sound: true,
        priority: 'max',
        vibrate: [0, 250, 250, 250],
      });
    }
  };

  registerTokenOnServer(vexpoToken){
    axios.put(this.serverBaseRoute + 'rest/user/adm/registrarDispositivo', {
      expoToken: vexpoToken
    }).then(res => {

    }).catch((error) => {
      Alert.alert('Error', 'ocurrio un error al registrar el dispositivo para las notificaciones.');
    });
  }

  componentDidMount() {
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  analize(notification){
    if(notification.data.Type === "Notificación"){
      if(notification.data.Action === "Vencimiento"){
        this.props.actions.hasReceivedExpiredCartNotification(true)
      }
    }
  }

  analizeIfMarks(notification){
    if(notification.data.Type === "Notificación"){
      this.markViewedNotification(notification.data.id);
    }
  }

  markViewedNotification(id) {
    this.setState({ loading: true })
    axios.post(this.serverBaseRoute + 'rest/user/adm/notificacion/' + id, {}, { withCredentials: true })
        .then(res => {
            this.props.actions.hasReceivedPushNotifications(true);
        }).catch((error) => {
            console.log(error)
        });
  }

  _handleNotification = notification => {
    //Vibration.vibrate();
    this.setState({ notification: notification });
    if(notification.origin === "received"){
      this.analize(notification)
      this.props.actions.hasReceivedPushNotifications(true);
    }
    if(notification.origin === "selected"){
      this.analizeIfMarks(notification)
    }
  };

  componentDidUpdate(){
    if(this.state.lastAccessId !== this.props.user.id){
      if(this.props.user.id !== 0){
        this.registerForPushNotificationsAsync();
      }
      this.resetData()
      this.setState({ lastAccessId: this.props.user.id, nickname:this.props.user.nickname})
    }
  }

  resetData(){
    let actions = this.props.actions
    actions.groupsData([])
    actions.groupSelected({})
    actions.historyShoppingCarts([])
    actions.historyCartSelected([])
    actions.invitationsData([])
    actions.memberSelected([])
    actions.openNodesData([])
    actions.personalData([])
    actions.shoppingCartSelected([])
    actions.shoppingCartSelected([])
    actions.shoppingCarts([])
    actions.accessOpenNodeRequests([])
  }

  createImageUrl(){
     let url = this.serverBaseRoute + (this.props.user.avatar.substring(1))
     url += '?random_number=' + new Date().getTime();
     return url
  }

  sideMenuComponent(props) {
    return (
      <ScrollView style={{ backgroundColor: "#ededed" }}>
        <Header containerStyle={{ backgroundColor: 'rgba(51, 102, 255, 1)', marginTop:-25 }}  >
          {this.props.user.id != 0 ? (
            <Image style={styles.userAvatar} source={{ uri: this.createImageUrl()}}></Image>
          ) : (
              <Image style={styles.userAvatar} source={require('./configurationViewComponents/configurationAssets/avatar_4.png')}></Image>
            )}

          <Text style={styles.nickText}>{this.props.user.nickname}</Text>
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