import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Header, Button, Icon, Badge } from 'react-native-elements';
import GLOBALS from '../../Globals'
import axios from 'axios'
import { AsyncStorage } from 'react-native';

class NavigationOptionItemsView extends React.PureComponent {
  constructor(props) {
    super(props)
    this.logout = props.actions.logout;
    this.navigation = this.props.navigation;
    this.serverBaseRoute = GLOBALS.BASE_URL;
  }

  async removeUserData() {
    try {
      await AsyncStorage.removeItem("user");
      this.navigation.closeDrawer()
      this.props.actions.vendorUnSelected()
      this.props.actions.shoppingCarts([])
      this.props.actions.shoppingCartUnselected()
      this.props.actions.groupsData([])
      this.unregisterUserFromNotifications()
      this.navigation.navigate("Catalogos")
      this.logout()
    } catch (error) {

    }
  };

  sendLogout() {    
    this.removeUserData()
  }

  errorAlert(error) {
    if (error.response) {
      if (error.response.status === 401) {
        Alert.alert(
          'Sesion expirada',
          'Su sesión expiro, se va a reiniciar la aplicación.',
          [
            { text: 'Entendido', onPress: () => this.props.actions.logout() },
          ],
          { cancelable: false },
        );
      } else {
        Alert.alert(
          'Error',
          'Ocurrió un error inesperado, sera reenviado a los catalogos. Si el problema persiste comuníquese con soporte técnico.',
          [
            { text: 'Entendido', onPress: () => this.props.actions.logout() },
          ],
          { cancelable: false },
        );
      }
    } else if (error.request) {
      Alert.alert('Error', "Ocurrio un error de comunicación con el servidor, intente más tarde",
      [
          { text: 'Entendido', onPress: () => this.props.actions.logout() },
      ],
      { cancelable: false },);
    } else {
      Alert.alert('Error', "Ocurrio un error al tratar de enviar la recuperación de contraseña, intente más tarde o verifique su conectividad.",
      [
          { text: 'Entendido', onPress: () => this.props.actions.logout() },
      ],
      { cancelable: false },);
    }
  }

  unregisterUserFromNotifications() {
    axios.put(this.serverBaseRoute + 'rest/user/adm/desvincularDispositivo').then(res => {
    }).catch((error) => {
    });
  }

  getUnreadNotifications() {
    axios.get(this.serverBaseRoute + 'rest/user/adm/notificacion/noLeidas', { withCredentials: true }).then(res => {
      this.props.actions.unreadNotifications(res.data);
    }).catch((error) => {
      this.errorAlert(error)
    });
  }

  logoutAlert() {
    Alert.alert(
      'Cerrar sesión',
      '¿Está segurx que desea cerrar la sesión?',
      [
        { text: 'No', onPress: () => null },
        { text: 'Si', onPress: () => this.sendLogout() },
      ])
  }

  goConfiguration() {
    this.navigation.navigate('Configuración');
  }

  goToNotifications() {
    this.navigation.navigate('Notificaciones');
  }

  componentDidUpdate() {
    if (this.props.hasReceivedPushNotifications) {
      this.getUnreadNotifications()
      this.props.actions.hasReceivedPushNotifications(false)
    }
  }


  render() {
    return (
      <View style={{ marginTop: 10 }}>
        {this.props.user.id !== 0 ? (
          <View style={{ marginLeft: 20, backgroundColor: "#ededed" }}>
            {this.props.vendorSelected.id !== undefined ? (
              <View>
                <Button icon={<Icon name="cog" type='font-awesome' size={20} iconStyle={styles.iconMenuButton} />}
                  buttonStyle={styles.menuButton}
                  onPress={() => this.goConfiguration()}
                  title="Configuración"
                  titleStyle={styles.menuButtonTitle}
                />
                <Button
                  icon={
                    <View style={{ justifyContent: "center" }}>
                      <Icon name="bell" type='font-awesome' size={20} iconStyle={styles.iconMenuButton} />

                      {this.props.unreadNotifications.length > 0 ? (
                        <Badge value={this.props.unreadNotifications.length} status="error" containerStyle={{ position: "absolute", left: 145 }} />
                      ) : (null)}
                    </View>
                  }
                  buttonStyle={styles.menuButton}
                  onPress={() => this.goToNotifications()}
                  title="Notificaciones"
                  titleStyle={styles.menuButtonTitle}
                >
                </Button>
              </View>
            ) : (null)}
            <Button icon={<Icon name="times-circle" type='font-awesome' size={20} iconStyle={styles.iconMenuButton} />}
              buttonStyle={styles.menuButton}
              onPress={() => this.logoutAlert()}
              title="Cerrar sesión"
              titleStyle={styles.menuButtonTitle}
            />
          </View>
        ) : (
            <View style={{ marginLeft: 20 }}>
              <Button icon={<Icon name="times-circle" type='font-awesome' size={20} iconStyle={styles.iconMenuButton} />}
                buttonStyle={styles.menuButton}
                onPress={() => this.logoutAlert()}
                title="Cerrar sesión"
                titleStyle={styles.menuButtonTitle}
              />
            </View>
          )
        }
      </View>
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
    color: "#00adee"
  },

});

export default NavigationOptionItemsView;