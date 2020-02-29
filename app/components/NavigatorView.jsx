import React from 'react';
import Login from '../containers/Login';
import Vendors from '../containers/Vendors';
import {Text, Header, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import { ScrollView , StyleSheet, Image, View, Alert} from 'react-native';


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const state = {};

class NavigatorView extends React.Component {
    constructor(props) {
        super(props);
        this.logout = props.actions.logout;
        state.isSignout = props.user.token == "";
    }  

    logoutAlert(){
      Alert.alert(
        'Cerrar sesión',
       '¿Esta seguro que desea cerrar la sesión?',
       [
        {text: 'Si', onPress: () =>  this.logout()},
        {text: 'No', onPress: () => null},
       ])
    }

    loginHeaderComponent(props){
        return(
        <ScrollView>
        <Header>
          <Image style={styles.userAvatar} source={{uri: "http://69.61.93.71/chasqui-dev-panel/" + this.props.user.avatar}}></Image>
          <Text style={styles.nickText}>{(this.props.user.nickname).toUpperCase()}</Text>
        </Header>
        <DrawerItemList {...props} />
        <View>
        <Button icon={<Icon name="bell" size={20} color="rgba(51, 102, 255, 1)" containerStyle={styles.iconMenuButton}/>}
                buttonStyle={styles.menuButton}
                onPress={() => Alert.alert('En Desarrollo', 'Sección en desarrollo')}
                title="Notificaciones"
                titleStyle = {styles.menuButtonTitle}
            />
        <Button icon={<Icon name="cog" size={20} color="rgba(51, 102, 255, 1)"/>}
                buttonStyle={styles.menuButton}
                onPress={() => Alert.alert('En Desarrollo', 'Sección en desarrollo')}
                title="Configuración"
                titleStyle = {styles.menuButtonTitle}
            />
        <Button icon={<Icon name="question-circle" size={20} color="rgba(51, 102, 255, 1)" style={{alignSelf:'flex-start'}}/>}
                buttonStyle={styles.menuButton}
                onPress={() => Alert.alert('En Desarrollo', 'Sección en desarrollo')}
                title="Ayuda"
                titleStyle = {styles.menuButtonTitle}
            />
        <Button icon={<Icon name="times-circle" size={20} color="rgba(51, 102, 255, 1)"/>}
                buttonStyle={styles.menuButton}
                onPress={() => this.logoutAlert()}
                title="Cerrar sesión"
                titleStyle = {styles.menuButtonTitle}
            />                
        </View>
        </ScrollView>
        );
    }

    render() {
        return(
            <NavigationContainer>
                {this.props.user.token == ""  ? (
                // No token found, user isn't signed in
                <Stack.Navigator>
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
                </Stack.Navigator>
                ) : (
                // User is signed in
                <Drawer.Navigator initialRouteName="Bienvenidxs" drawerContentOptions={{headerTintColor: "DarkBlue",}} drawerContent={props => this.loginHeaderComponent(props)}>
                    <Drawer.Screen name='Catalogos' component={Vendors}/>
                </Drawer.Navigator>
                )}                    
            </NavigationContainer>
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
    alignSelf:'flex-start'
  },
  menuButtonTitle:{
    color:"black",
    alignSelf:'flex-end'
  },
  iconMenuButton:{
    marginRight: 15,
  }
});

export default NavigatorView;