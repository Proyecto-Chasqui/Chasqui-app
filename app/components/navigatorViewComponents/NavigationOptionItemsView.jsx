import React from 'react';
import { View , StyleSheet, Alert} from 'react-native';
import { Text, Header, Button, Icon, Badge } from 'react-native-elements';

class NavigationOptionItemsView extends React.PureComponent{
    constructor(props){
        super(props)
        this.logout = props.actions.logout;
        this.navigation = this.props.navigation;
    }

    sendLogout(){
      this.navigation.closeDrawer()
      this.props.actions.vendorUnSelected()
      this.props.actions.shoppingCarts([])
      this.props.actions.shoppingCartUnselected()
      this.logout()
    }

    logoutAlert(){
        Alert.alert(
          'Cerrar sesión',
         '¿Está segurx que desea cerrar la sesión?',
         [
          {text: 'Si', onPress: () =>  this.sendLogout()},
          {text: 'No', onPress: () => null},
         ])
      }

    goConfiguration(){
      this.navigation.navigate('Configuración');
    }

    goToNotifications(){
      this.navigation.navigate('Notificaciones');
    }

    render(){
        return(
            <View style={{marginTop:10}}>
            { this.props.user.id !== 0 ?(
                <View style={{marginLeft:20, backgroundColor:"#ededed" }}>
                {this.props.vendorSelected.id !== undefined ? (
                <View>
                <Button icon={<Icon name="cog" type='font-awesome' size={20} iconStyle={styles.iconMenuButton}/>}
                        buttonStyle={styles.menuButton}
                        onPress={() => this.goConfiguration()}
                        title="Configuración"
                        titleStyle = {styles.menuButtonTitle}
                    />
                <Button icon={
                <Icon name="bell" type='font-awesome' size={20} iconStyle={styles.iconMenuButton} />}
                    buttonStyle={styles.menuButton}
                    onPress={() => this.goToNotifications()}
                    title="Notificaciones"
                    titleStyle = {styles.menuButtonTitle}
                />
                {this.props.unreadNotifications.length > 0 ? (
                    <Badge value={this.props.unreadNotifications.length} status="error" containerStyle={{ position: 'absolute', top: 54, left:150 }}/>
                    ):(null)}
                </View>
                    ):(null)}
                <Button icon={<Icon name="question-circle" type='font-awesome' size={20} iconStyle={styles.iconMenuButton}/>}
                        buttonStyle={styles.menuButton}
                        onPress={() => Alert.alert('En Desarrollo', 'Sección en desarrollo')}
                        title="Ayuda"
                        titleStyle = {styles.menuButtonTitle}
                    />
                <Button icon={<Icon name="times-circle" type='font-awesome' size={20} iconStyle={styles.iconMenuButton}/>}
                        buttonStyle={styles.menuButton}
                        onPress={() => this.logoutAlert()}
                        title="Cerrar sesión"
                        titleStyle = {styles.menuButtonTitle}
                    />                
                </View>
                ):(
                  <View style={{marginLeft:20}}>
                  <Button icon={<Icon name="question-circle" type='font-awesome' size={20} iconStyle={styles.iconMenuButton}/>}
                  buttonStyle={styles.menuButton}
                  onPress={() => Alert.alert('En Desarrollo', 'Sección en desarrollo')}
                  title="Ayuda"
                  titleStyle = {styles.menuButtonTitle}
                  />
                  <Button icon={<Icon name="times-circle" type='font-awesome' size={20} iconStyle={styles.iconMenuButton}/>}
                          buttonStyle={styles.menuButton}
                          onPress={() => this.logoutAlert()}
                          title="Cerrar sesión"
                          titleStyle = {styles.menuButtonTitle}
                      />                
                  </View>
                )
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    userAvatar:{
      width: 40,
      height: 40,
      resizeMode: 'cover',
      marginLeft: 15
    },
    nickText:{
      fontSize: 18,
      fontWeight: "bold",
      color:"white",
      width: 150,
      marginLeft: 30,
    },
    menuButton:{
      backgroundColor:'#66000000',
      alignSelf:'flex-start',
    },
    menuButtonTitle:{
      color:"black",
      alignSelf:'flex-end'
    },
  
    iconMenuButton:{
      marginRight: 15,
      color:"rgba(51, 102, 255, 1)" 
    },
  
  });

export default NavigationOptionItemsView;